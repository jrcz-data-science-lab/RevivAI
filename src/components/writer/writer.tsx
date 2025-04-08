import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { FileText, LibraryBig, Plus, Settings } from 'lucide-react';
import { AnimatedText } from '../ui/animated-text';

export function Writer() {
	const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
	const [chapters, setChapters] = useState([
		{ id: 1, title: 'Chapter 1', content: 'This is the content of chapter 1.' },
		{ id: 2, title: 'Chapter 2', content: 'This is the content of chapter 2.' },
		{ id: 3, title: 'Chapter 3', content: 'This is the content of chapter 3.' },
		{ id: 4, title: 'Chapter 4', content: 'This is the content of chapter 4.' },
		{ id: 5, title: 'Chapter 5', content: 'This is the content of chapter 5.' },
		{ id: 6, title: 'Chapter 6', content: 'This is the content of chapter 6.' },
		{ id: 7, title: 'Chapter 7', content: 'This is the content of chapter 7.' },
		{ id: 8, title: 'Chapter 8', content: 'This is the content of chapter 8.' },
		{ id: 9, title: 'Chapter 9', content: 'This is the content of chapter 9.' },
		{ id: 10, title: 'Chapter 10', content: 'This is the content of chapter 10.' },
		{ id: 11, title: 'Chapter 11', content: 'This is the content of chapter 11.' },
		{ id: 12, title: 'Chapter 12', content: 'This is the content of chapter 12.' },
		// { id: 13, title: 'Chapter 13', content: 'This is the content of chapter 13.' },
		// { id: 14, title: 'Chapter 14', content: 'This is the content of chapter 14.' },
		// { id: 15, title: 'Chapter 15', content: 'This is the content of chapter 15.' },
		// { id: 16, title: 'Chapter 16', content: 'This is the content of chapter 16.' },
		// { id: 17, title: 'Chapter 17', content: 'This is the content of chapter 17.' },
		// { id: 18, title: 'Chapter 18', content: 'This is the content of chapter 18.' },
		// { id: 19, title: 'Chapter 19', content: 'This is the content of chapter 19.' },
		// { id: 20, title: 'Chapter 20', content: 'This is the content of chapter 20.' },
		// { id: 21, title: 'Chapter 21', content: 'This is the content of chapter 21.' },
		// { id: 22, title: 'Chapter 22', content: 'This is the content of chapter 22.' },
		// { id: 23, title: 'Chapter 23', content: 'This is the content of chapter 23.' },
		// { id: 24, title: 'Chapter 24', content: 'This is the content of chapter 24.' },
		// { id: 25, title: 'Chapter 25', content: 'This is the content of chapter 25.' },
		// { id: 26, title: 'Chapter 26', content: 'This is the content of chapter 26.' },
		// { id: 27, title: 'Chapter 27', content: 'This is the content of chapter 27.' },
		// { id: 28, title: 'Chapter 28', content: 'This is the content of chapter 28.' },
		// { id: 29, title: 'Chapter 29', content: 'This is the content of chapter 29.' },
		// { id: 30, title: 'Chapter 30', content: 'This is the content of chapter 30.' },
	]);

	const currentChapter = chapters.find((chapter) => chapter.id === selectedChapterId);

	const addChapter = () => {
		const newChapter = {
			id: chapters.length + 1,
			title: `Chapter ${chapters.length + 1}`,
			content: `This is the content of chapter ${chapters.length + 1}.`,
		};

		setChapters((prevChapters) => [...prevChapters, newChapter]);
		setSelectedChapterId(newChapter.id);
	};

	return (
		<div className="flex flex-col overflow-hidden h-screen w-screen">
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={20} minSize={14} maxSize={40} className="bg-muted">
					<motion.div
						initial={{ translateX: -16, opacity: 0 }}
						animate={{ translateX: 0, opacity: 1 }}
						className="h-full flex flex-col text-sm overflow-hidden pt-16"
					>
						<div className="flex flex-col flex-none text-muted-foreground py-6">
							<div className="flex flex-col gap-3 px-6">
								<div className="flex gap-2 items-center text-muted-foreground">
									<LibraryBig className="w-4 h-4" />
									<span>Templates</span>
								</div>

								<div className="flex gap-2 items-center text-muted-foreground">
									<Settings className="w-4 h-4" />
									<span>Settings</span>
								</div>
							</div>
						</div>

						<div className="flex flex-col flex-1 overflow-hidden relative">
							<div className="px-6 pt-6 pb-1.5 uppercase text-muted-foreground text-xs flex-none">Chapters</div>

							<div className="flex-1 overflow-y-auto px-6">
								<div className="flex flex-col">
									<AnimatePresence>
										{chapters.map((chapter) => {
											const active = chapter.id === selectedChapterId;

											return (
												<motion.button
													type="button"
													key={chapter.id}
													onClick={() => setSelectedChapterId(chapter.id)}
													transition={{ duration: 0.1 }}
													initial={{ opacity: 0, translateX: -4 }}
													animate={{ opacity: 1, translateX: 0 }}
													exit={{ opacity: 0, translateX: -4 }}
													className={cn(
														'flex gap-2 py-1.5 items-center cursor-pointer transition-all',
														active ? 'text-foreground translate-x-1' : 'text-muted-foreground hover:translate-x-1 active:scale-95 active:-translate-x-1',
													)}
												>
													<FileText className="w-4 h-4" />
													<span>{chapter.title}</span>
												</motion.button>
											);
										})}
									</AnimatePresence>
								</div>
							</div>

							<div className="flex-none p-3 bg-muted">
								<Button variant="outline" className="w-full" size="lg" onClick={addChapter}>
									<Plus className="h-4 w-4 mr-2" />
									New Chapter
								</Button>
							</div>
						</div>
					</motion.div>
				</ResizablePanel>

				<ResizableHandle />

				<ResizablePanel className="h-screen pt-16 px-8">
					<div key={currentChapter?.id}>
						<AnimatedText as="h2" className="text-2xl font-black font-serif">
							{currentChapter?.title}
						</AnimatedText>
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
