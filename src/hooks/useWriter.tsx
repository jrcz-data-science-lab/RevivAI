import { generateText, type LanguageModelV1 } from 'ai';
import type { Chapter, Database } from './useDb';
import type { WriterTemplatesType } from '@/components/writer/writer-templates';
import { toast } from 'sonner';
import { useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { applyReadmeTemplate } from '@/lib/templates/readmeTemplate';
import { applyGenerateTemplate } from '@/lib/templates/generateTemplate';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
import { createTOCPrompt } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSettings } from './useSettings';
import writerSystemPrompt from '@/lib/prompts/writer.md?raw';

export interface UseWriterProps {
	db: Database;
	model: LanguageModelV1;
}

// Type of opened items in the sidebar. String is a UUID of user created chapter.
export type WriterItemId = 'generate' | 'templates' | string;

// True if removing of pending files was triggered
let pendingWasDeleted = false;

// Last active item ID in the sidebar. Stored in local storage.
const activeItemIdAtom = atomWithStorage<WriterItemId>('active-item-id', 'templates');

/**
 * Custom hook to manage the writer state and actions.
 */
export function useWriter({ db, model }: UseWriterProps) {
	const { settings, getLanguagePrompt } = useSettings();
	const abortControllerRef = useRef<AbortController | null>(null);

	// const abortController = useMemo(() => new AbortController(), []);
	const [activeItemId, setActiveItemId] = useAtom(activeItemIdAtom);

	// Fetch chapters from the database, sorted by index
	const chapters = useLiveQuery(async () => {
		const records = await db.chapters.toArray();
		return records.sort((a, b) => a.index - b.index);
	}, [db]);

	// True if there is generation in progress
	const isGenerating =
		useLiveQuery(async () => {
			const generatedCount = await db.generated.where('status').equals('pending').count();
			return generatedCount > 0;
		}, [chapters]) || false;

	// Refresh the unfinished chapters when the component mounts
	useEffect(() => {
		if (pendingWasDeleted) return;
		pendingWasDeleted = true;

		const deletePending = async () => {
			const pendingChapters = await db.generated.where('status').equals('pending').toArray();
			const pendingExports = pendingChapters.map((chapter) => chapter.exportId);
			const uniquePendingExports = [...new Set(pendingExports)];

			await db.generated.where('exportId').anyOf(uniquePendingExports).delete();
		};

		deletePending();
	}, []);

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
			const abort = () => {
				abortController.abort();
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
			});
		}
	};

	/**
	 * Generate documentation based on the chapters and configuration.
	 * @param config - The configuration for generation.
	 */
	const generate = async () => {
		const exportId = crypto.randomUUID() as string;

		// Abort previous generation if in progress
		if (abortControllerRef.current) abortControllerRef.current.abort();

		// Set abort controller to cancel generation
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		try {
			const [codebase] = await db.codebases.toArray();
			if (!codebase) {
				toast.error('No codebase found. Please add a codebase first.');
				return;
			}

			if (!chapters || chapters.length === 0) {
				toast.error('No chapters found. Please add a chapter first.');
				return;
			}

			// Initiate export, create files for each chapter
			await db.generated.bulkAdd(
				chapters.map((chapter) => ({
					id: crypto.randomUUID(),
					exportId,
					chapterId: chapter.id,
					status: 'pending',
					createdAt: new Date(),
					updatedAt: new Date(),
					fileName: chapter.title.trim().endsWith('.md') ? chapter.title.trim() : `${chapter.title.trim()}.md`,
					content: '',
				})),
			);

			const toc = createTOCPrompt(chapters);
			const languagePrompt = getLanguagePrompt();

			// Get 'pending' saved files from database
			const generatedFiles = await db.generated.where('exportId').equals(exportId).toArray();

			// Store promises for awaiting and parallelization
			const promises: Promise<void>[] = [];

			for (const file of generatedFiles) {
				const chapter = chapters?.find((chapter) => chapter.id === file.chapterId);
				if (!chapter) continue;

				// Function to generate chapter content
				const generateChapter = async (chapter: Chapter) => {
					console.log(`Generating chapter "${chapter.title}"...`);

					const metadata = {
						fileName: file.fileName,
						createdAt: file.createdAt.toLocaleString(),
						repositoryUrl: codebase.repositoryUrl || 'not specified',
					};

					const { text } = await generateText({
						abortSignal: abortController.signal,
						model,
						messages: [
							{ role: 'system', content: writerSystemPrompt },
							{ role: 'user', content: codebase.prompt },
							{ role: 'user', content: languagePrompt },
							{ role: 'user', content: `# Table of Contents: \n\n ${toc}` },
							{ role: 'user', content: `# Chapter Metadata: \n\n${JSON.stringify(metadata, null, 2)}` },
							{ role: 'user', content: `# Chapter Outline / Template: \n\n ${chapter.outline}` },
						],
					});

					// If file doesn't exist anymore, skip it
					const fileExists = await db.generated.where('id').equals(file.id).count();
					if (fileExists === 0) return;

					await db.generated.update(file.id, {
						status: 'completed',
						updatedAt: new Date(),
						content: text,
					});

					console.log(`Chapter "${chapter.title}" generated successfully!`);
				};

				// Start promise
				promises.push(generateChapter(chapter));

				// Await execution if the number of promises exceeds the parallelization limit
				if (promises.length >= settings.parallelization) {
					await Promise.all(promises);
					promises.length = 0; // Clear the array
				}
			}

			// Await all promises in parallelized mode
			await Promise.all(promises);

			toast.success('Documentation generated successfully!');
		} catch (error) {
			// Log error only when error is not abort message is not 'cancelGeneration'
			if (error !== 'cancelGeneration') {
				console.error('Error generating documentation:', error);
				toast.error(`Error generating documentation: ${(error as Error)?.message || error}`, { richColors: true });
			}

			await db.generated.where('exportId').equals(exportId).delete();
		}
	};

	/**
	 * Cancel the current generation process.
	 * @param exportId - The ID of the export to cancel. If not provided, all pending generations will be cancelled.
	 */
	const cancelGeneration = async (exportId?: string) => {
		if (abortControllerRef.current) abortControllerRef.current.abort('cancelGeneration');

		if (exportId) {
			await db.generated.where({ exportId }).delete();
		} else {
			await db.generated.where({ status: 'pending' }).delete();
		}

		toast.success('Generation cancelled.');
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
		cancelGeneration,
		applyTemplate,
	};
}
