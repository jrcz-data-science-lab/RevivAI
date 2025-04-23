import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { WriterSidebar } from './writer-sidebar';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Chapter, Database } from '@/hooks/useDb';
import type { LanguageModelV1 } from 'ai';
import { WriterEditor } from './writer-editor';
import { WriterExport } from './writer-export';
import { WriterTemplates } from './writer-templates';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface WriterProps {
	db: Database;
	model: LanguageModelV1;
}

type WriterPages = 'export' | 'templates' | 'settings' | string;

export function Writer({ db, model }: WriterProps) {
	const chapters = useLiveQuery(async () => {
		const chapters = await db.chapters.toArray();
		return chapters.sort((a, b) => a.index - b.index);
	}, [db]);

	const [activeItemId, setActiveItemId] = useState<WriterPages>('templates');
	
	const renderActiveItem = (id: WriterPages) => {
		if (id === 'export') return <WriterExport />;
		if (id === 'templates') return <WriterTemplates />;
		if (id === 'settings') return <div>Settings</div>;
		
		const chapter = chapters?.find((chapter) => chapter.id === activeItemId);
		if (chapter) return <WriterEditor chapter={chapter} />;
	};

	const addChapter = async () => {
		const id = crypto.randomUUID() as string;
		console.log('Adding chapter with id:', db);

		// Find the last chapter based on the index

		const lastChapterIndex: number =
			chapters?.reduce((maxIndex, chapter) => {
				return Math.max(maxIndex, chapter.index);
			}, -1) ?? 0;

		await db.chapters.add({
			id: id,
			index: lastChapterIndex + 1,
			title: `Chapter ${chapters?.length}`,
			content: '',
		});

		setActiveItemId(id);
	};

	const removeChapter = async (id: string) => {
		await db.chapters.delete(id);
		// if (selectedChapterId === id) setSelectedChapterId(chapters[0]?.id ?? undefined);
	};

	const reorderChapters = async (newChapters: Chapter[]) => {
		const chapters = newChapters.map((chapter, index) => ({
			...chapter,
			index: index,
		}));

		await db.chapters.bulkUpdate(
			chapters.map((chapter, index) => {
				return {
					key: chapter.id,
					changes: { index },
				};
			}),
		);
	};

	return (
		<div className="flex flex-col overflow-hidden h-screen w-screen">
			<div className="flex">
				<div className="relative z-40 bg-muted border-r flex flex-col w-full h-screen max-w-64">
					<WriterSidebar
						chapters={chapters}
						activeItemId={activeItemId}
						onSelect={setActiveItemId}
						onReorder={reorderChapters}
						onRemoveChapter={removeChapter}
					/>

					<div className="p-3 bg-muted absolute bottom-0 left-0 w-full flex items-center justify-center">
						<Button variant="outline" className="w-full" size="lg" onClick={addChapter}>
							<Plus className="h-4 w-4 mr-2" />
							New Chapter
						</Button>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, translateY: 8 }}
					animate={{ opacity: 1, translateY: 0 }}
					exit={{ opacity: 0, translateY: 8 }}
					transition={{ duration: 0.6, type: 'spring' }}
					className="relative z-20 h-screen pt-16 px-8 w-full overflow-x-hidden overflow-y-scroll"
				>
					<div className="fixed top-0 left-0 w-full">
						<div className="absolute w-full h-16 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-12 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-8 bg-gradient-to-b from-background to-transparent" />
					</div>

					<div className="flex flex-col w-full justify-center space-y-6 pr-38">
						<div className="my-16">{renderActiveItem(activeItemId)}</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
