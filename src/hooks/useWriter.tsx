import { generateText, type LanguageModelV1 } from 'ai';
import type { Chapter, Database } from './useDb';
import type { WriterTemplatesType } from '@/components/writer/writer-templates';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { applyReadmeTemplate } from '@/lib/templates/readmeTemplate';
import { applyGenerateTemplate } from '@/lib/templates/generateTemplate';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
import { createTOCPrompt } from '@/lib/utils';
import writerSystemPrompt from '@/lib/prompts/writer.md?raw';
import { Button } from '@/components/ui/button';

export interface UseWriterProps {
	db: Database;
	model: LanguageModelV1;
}

// Type of opened items in the sidebar. String is a UUID of user created chapter.
export type WriterItemId = 'generate' | 'templates' | string;

// Config for documentation generation
export interface WriterGenerateConfig {
	diagrams: 'none' | 'mermaid' | 'svg';
}

// Last active item ID in the sidebar. Stored in local storage.
const activeItemIdAtom = atomWithStorage<WriterItemId>('active-item-id', 'templates');

/**
 * Custom hook to manage the writer state and actions.
 */
export function useWriter({ db, model }: UseWriterProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [activeItemId, setActiveItemId] = useAtom(activeItemIdAtom);

	// Fetch chapters from the database, sorted by index
	const chapters = useLiveQuery(async () => {
		const records = await db.chapters.toArray();
		return records.sort((a, b) => a.index - b.index);
	}, [db]);

	/**
	 * Add a new chapter to the database.
	 */
	const addChapter = async () => {
		const id = crypto.randomUUID() as string;

		// Find the last chapter based on the index
		const lastChapterIndex = chapters?.reduce((maxIndex, chapter) => Math.max(maxIndex, chapter.index), -1) ?? 0;

		await db.chapters.add({
			id: id,
			index: lastChapterIndex + 1,
			title: `Chapter ${chapters?.length}`,
			outline: '',
		});

		setActiveItemId(id);
	};

	/**
	 * Update chapter in the database.
	 * @param id - The ID of the chapter to update.
	 * @param data - The data to update the chapter with.
	 */
	const updateChapter = async (id: string, data: Partial<Chapter>) => {
		const chapter = await db.chapters.get(id);
		if (chapter) await db.chapters.update(id, { ...chapter, ...data });
	};

	/**
	 * Delete a chapter from the database.
	 * @param id - The ID of the chapter to delete.
	 */
	const removeChapter = async (id: string) => {
		// Set active item to closest chapter
		if (activeItemId === id) {
			if (!chapters) return setActiveItemId('templates');

			const currentChapterIndex = chapters?.findIndex((chapter) => chapter.id === id);
			const nextItemId = chapters?.at(currentChapterIndex + 1)?.id;
			const previousItemId = chapters?.at(currentChapterIndex - 1)?.id;
			const firstChapterId = chapters?.at(0)?.id;
			setActiveItemId(nextItemId ?? previousItemId ?? firstChapterId ?? 'templates');
		}

		await db.chapters.delete(id);
	};

	/**
	 * Reorder chapters in the database.
	 * @param newOrder - The new order of chapters.
	 */
	const reorderChapters = async (newOrder: Chapter[]) => {
		await db.chapters.bulkUpdate(newOrder.map((chapter, index) => ({ key: chapter.id, changes: { index } })));
	};

	/**
	 * Apply a template to the database.
	 * @param template - The template name to apply.
	 */
	const applyTemplate = async (template: WriterTemplatesType) => {
		const abortController = new AbortController();
		let applyPromise: Promise<void> | null = null;

		if (template === 'readme') applyPromise = applyReadmeTemplate(db);
		if (template === 'generate') applyPromise = applyGenerateTemplate(db, model, abortController.signal);

		if (applyPromise) {
			setIsGenerating(true);

			const abort = () => {
				abortController.abort();
				setIsGenerating(false);
				toast.dismiss();
			};

			toast.promise(applyPromise, {
				loading: 'Applying template...',
				closeButton: false,
				action: (
					<Button size="sm" variant="outline" className="ml-auto" onClick={abort}>
						Cancel
					</Button>
				),
				success: () => {
					setActiveItemId('templates');
					return `Template "${template}" applied successfully!`;
				},
				error: (error) => {
					if (abortController.signal.aborted) return 'Template application aborted';
					console.error('Error applying template:', error);
					return `Error applying template: ${error?.error?.message || error?.error || error}`;
				},
				onDismiss: () => {
					abortController.abort();
				},
				finally: () => {
					setIsGenerating(false);
				},
			});
		}
	};

	/**
	 * Generate documentation based on the chapters and configuration.
	 * @param config - The configuration for generation.
	 */
	const generate = async (config: WriterGenerateConfig) => {
		const exportId = crypto.randomUUID() as string;
		setIsGenerating(true);

		try {
			const [codebase] = await db.codebases.toArray();
			if (!codebase) {
				toast.error('No codebase found. Please add a codebase first.');
				return;
			}

			// Initiate export, create files for each chapter
			for (const chapter of chapters ?? []) {
				const id = crypto.randomUUID() as string;

				const chapterTitle = chapter.title.trim();
				const fileName = chapterTitle.endsWith('.md') ? chapterTitle : `${chapterTitle}.md`;

				await db.generated.add({
					id: id,
					exportId: exportId,
					chapterId: chapter.id,
					status: 'pending',
					createdAt: new Date(),
					updatedAt: new Date(),
					fileName,
					content: '',
				});
			}

			// Create table of contents prompt
			const toc = createTOCPrompt(chapters ?? []);

			// Get 'pending' saved files from database
			const generatedFiles = await db.generated.where('exportId').equals(exportId).toArray();

			for (const file of generatedFiles) {
				const chapter = chapters?.find((chapter) => chapter.id === file.chapterId);
				if (!chapter) continue;

				const { text } = await generateText({
					model,
					messages: [
						{ role: 'system', content: writerSystemPrompt },
						{ role: 'user', content: codebase.prompt },
						{ role: 'user', content: `# Table of Contents: \n\n ${toc}` },
						{ role: 'user', content: `# Chapter Template: \n\n ${chapter.outline}` },
					],
				});

				await db.generated.update(file.id, {
					status: 'completed',
					updatedAt: new Date(),
					content: text,
				});
			}

			toast.success('Documentation generated successfully!', { richColors: true });
		} finally {
			setIsGenerating(false);
		}
	};

	return {
		isGenerating,
		setActiveItemId,
		activeItemId,
		chapters,
		addChapter,
		updateChapter,
		removeChapter,
		reorderChapters,
		generate,
		applyTemplate,
	};
}
