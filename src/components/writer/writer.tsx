import { useState } from 'react';
import { motion } from 'motion/react';
import { AnimatedText } from '../ui/animated-text';
import { WriterSidebar } from './writer-sidebar';
import { type Chapter } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import type { Database } from '@/hooks/useDb';

interface WriterProps {
	db: Database;
}

export function Writer({ db }: WriterProps) {
	const chapters = useLiveQuery(async () => {
		const chapters = await db.chapters.toArray();
		return chapters.sort((a, b) => a.index - b.index);
	}, [db]);

	// const [chapters, setChapters] = useState<Chapter[]>([]);
	const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(chapters?.[0].id ?? undefined);
	const currentChapter = chapters?.find((chapter) => chapter.id === selectedChapterId);

	const addChapter = async () => {
		const id = crypto.randomUUID() as string;
		console.log('Adding chapter with id:', db);

		// Find the last chapter based on the index
		const lastChapter = chapters.reduce((prev, curr) => (prev.index > curr.index ? prev : curr), chapters[0]);

		await db.chapters.add({
			id: id,
			index: lastChapter?.index + 1,
			title: `Chapter ${chapters.length + 1}`,
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

		db.chapters.bulkUpdate(
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
				{chapters?.length && (
					<WriterSidebar
						chapters={chapters}
						setChapters={reorderChapters}
						selectedChapterId={selectedChapterId}
						setSelectedChapterId={setSelectedChapterId}
						addChapter={addChapter}
						removeChapter={removeChapter}
					/>
				)}

				<div className="h-screen pt-16 px-8">
					<div key={currentChapter?.id}>
						<AnimatedText as="h2" className="text-2xl font-black font-serif">
							{currentChapter?.title}
						</AnimatedText>
					</div>
				</div>
			</div>
		</div>
	);
}
