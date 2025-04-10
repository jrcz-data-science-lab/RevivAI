import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { AnimatedText } from '../ui/animated-text';
import { WriterSidebar } from './writer-sidebar';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Database } from '@/hooks/useDb';
import type { Chapter } from '@/lib/db';

interface WriterProps {
	db: Database;
}

export function Writer({ db }: WriterProps) {
	const chapters = useLiveQuery(async () => {
		const chapters = await db.chapters.toArray();
		return chapters.sort((a, b) => a.index - b.index);
	}, [db]);

	// const [chapters, setChapters] = useState<Chapter[]>([]);
	const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(undefined);
	const currentChapter = chapters?.find((chapter) => chapter.id === selectedChapterId);

	useEffect(() => {
		if (chapters?.length && !selectedChapterId) {
			setSelectedChapterId(chapters[0].id);
		}
	}, [chapters]);

	const addChapter = async () => {
		const id = crypto.randomUUID() as string;
		console.log('Adding chapter with id:', db);

		// Find the last chapter based on the index

		const lastChapterIndex: number = chapters?.reduce((maxIndex, chapter) => {
			return Math.max(maxIndex, chapter.index);
		}, -1) ?? 0;

		await db.chapters.add({
			id: id,
			index: lastChapterIndex + 1,
			title: `Chapter ${chapters?.length + 1}`,
			content: '',
		});

		setSelectedChapterId(id);
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

	console.log('Chapters:', chapters);

	return (
		<div className="flex flex-col overflow-hidden h-screen w-screen">
			<div className="flex">
				<WriterSidebar
					chapters={chapters}
					setChapters={reorderChapters}
					selectedChapterId={selectedChapterId}
					setSelectedChapterId={setSelectedChapterId}
					addChapter={addChapter}
					removeChapter={removeChapter}
				/>

				<div className="h-screen pt-16 px-8">
					<div key={currentChapter?.id}>
						<AnimatedText as="h2" className="text-xl font-black font-serif">
							{currentChapter?.title}
						</AnimatedText>
					</div>
				</div>
			</div>
		</div>
	);
}
