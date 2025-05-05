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
import { createTOCPrompt } from '@/lib/generate';
import writerSystemPrompt from '@/lib/prompts/writer.md?raw';

export interface UseWriterProps {
	db: Database;
	model: LanguageModelV1;
}

// Type of opened items in the sidebar. String is a UUID of user created chapter.
export type WriterItemId = 'generate' | 'templates' | string;

// Config for documentation generation
export interface WriterGenerateConfig {
	entry: 'readme' | 'none';
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
		await db.chapters.bulkUpdate(
			newOrder.map((chapter, index) => {
				return { key: chapter.id, changes: { index } };
			}),
		);
	};

	/**
	 * Apply a template to the database.
	 * @param template - The template name to apply.
	 */
	const applyTemplate = async (template: WriterTemplatesType) => {
		setIsGenerating(true);

		const abortController = new AbortController();
		let applyPromise: Promise<void> | null = null;

		if (template === 'readme') applyPromise = applyReadmeTemplate(db);
		if (template === 'generate') applyPromise = applyGenerateTemplate(db, model, abortController.signal);

		if (applyPromise) {
			toast.promise(applyPromise, {
				loading: 'Applying template...',
				closeButton: false,
				success: () => {
					setActiveItemId('templates');
					return `Template "${template}" applied successfully!`;
				},
				error: (error) => {
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
		const generationId = crypto.randomUUID() as string;
		setIsGenerating(true);

		try {
			const [codebase] = await db.codebases.toArray();
			if (!codebase) {
				toast.error('No codebase found. Please add a codebase first.');
				return;
			}

			for (const chapter of chapters ?? []) {
				const { text } = await generateText({
					model,
					messages: [
						{ role: 'system', content: writerSystemPrompt },
						{ role: 'user', content: codebase.prompt },
						{ role: 'user', content: chapter.outline },
					],
				});

				const fileName = chapter.title.trim().endsWith('.md') ? chapter.title.trim() : `${chapter.title.trim()}.md`;

				await db.generated.add({
					id: crypto.randomUUID() as string,
					chapterId: chapter.id,
					generationId: generationId,
					createdAt: new Date(),
					fileName,
					content: text,
				});
			}

			console.log(createTOCPrompt(chapters ?? []));
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
