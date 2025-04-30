import type { LanguageModelV1 } from 'ai';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useState } from 'react';
import type { Chapter, Database } from './useDb';
import { useLiveQuery } from 'dexie-react-hooks';
import type { WriterTemplatesType } from '@/components/writer/writer-templates';
import { toast } from 'sonner';
import { applyReadmeTemplate } from '@/lib/templates/readmeTemplate';
import { applyGenerateTemplate } from '@/lib/templates/generateTemplate';

export interface UseWriterProps {
	db: Database;
	model: LanguageModelV1;
}

export type WriterPages = 'export' | 'templates' | 'settings' | string;

// Initial active item ID
const initialActiveItemId = localStorage.getItem('active-item-id') ?? 'templates';

/**
 * Custom hook to manage the writer state and actions.
 */
export function useWriter({ db, model }: UseWriterProps) {
	const [locked, setLocked] = useState(false);
	const [activeItemId, setActiveItemId] = useState<WriterPages>(initialActiveItemId);

	// Fetch chapters from the database, sorted by index
	const chapters = useLiveQuery(async () => {
		const records = await db.chapters.toArray();
		return records.sort((a, b) => a.index - b.index);
	}, [db]);

	/**
	 * Set the active item ID and store it in local storage.
	 * @param id - The ID of the item (or chapter) to set as active.
	 * @returns A promise that resolves when the item is set as active.
	 */
	const selectItem = (id: WriterPages) => {
		localStorage.setItem('active-item-id', id);
		setActiveItemId(id);
	};

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
			description: '',
			content: '',
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
			if (!chapters) return selectItem('templates');

			const currentChapterIndex = chapters?.findIndex((chapter) => chapter.id === id);
			const nextItemId = chapters?.at(currentChapterIndex + 1)?.id;
			const previousItemId = chapters?.at(currentChapterIndex - 1)?.id;
			const firstChapterId = chapters?.at(0)?.id;
			selectItem(nextItemId ?? previousItemId ?? firstChapterId ?? 'templates');
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
		let applyPromise: Promise<void> | null = null;

		if (template === 'readme') applyPromise = applyReadmeTemplate(db);
		if (template === 'generate') applyPromise = applyGenerateTemplate(db, model);

		if (applyPromise) {
			toast.promise(applyPromise, {
				loading: 'Applying template...',
				success: () => {
					selectItem('templates');
					return 'Template applied successfully!';
				},

				error: (error) => {
					return `Error applying template: ${error}`;
				},
			});
		}
	};

	return {
		selectItem,
		activeItemId,
		setActiveItemId,
		chapters,
		addChapter,
		updateChapter,
		removeChapter,
		reorderChapters,
		applyTemplate,
	};
}
