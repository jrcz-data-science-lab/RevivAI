import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useChat } from '../../hooks/useChat';
import { AnimatedText } from '../ui/animated-text';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { ArrowLeft, FileText, LibraryBig, Plus, StickyNote } from 'lucide-react';

// <div className='fixed bottom-0 left-0 bg-amber-300 h-[calc(100vh-64px)] w-full'>sdfsdf</div>}

export function Writer() {
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
		{ id: 13, title: 'Chapter 13', content: 'This is the content of chapter 13.' },
		{ id: 14, title: 'Chapter 14', content: 'This is the content of chapter 14.' },
		{ id: 15, title: 'Chapter 15', content: 'This is the content of chapter 15.' },
		{ id: 16, title: 'Chapter 16', content: 'This is the content of chapter 16.' },
		{ id: 17, title: 'Chapter 17', content: 'This is the content of chapter 17.' },
		{ id: 18, title: 'Chapter 18', content: 'This is the content of chapter 18.' },
		{ id: 19, title: 'Chapter 19', content: 'This is the content of chapter 19.' },
		{ id: 20, title: 'Chapter 20', content: 'This is the content of chapter 20.' },
		{ id: 21, title: 'Chapter 21', content: 'This is the content of chapter 21.' },
		{ id: 22, title: 'Chapter 22', content: 'This is the content of chapter 22.' },
		{ id: 23, title: 'Chapter 23', content: 'This is the content of chapter 23.' },
		{ id: 24, title: 'Chapter 24', content: 'This is the content of chapter 24.' },
		{ id: 25, title: 'Chapter 25', content: 'This is the content of chapter 25.' },
	]);

	return (
		<div className="flex flex-col w-full overflow-x-hidden max-h-screen min-h-screen">
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel className="h-screen pt-16 bg-muted text-sm" defaultSize={20} minSize={14}>
					<motion.div initial={{ translateX: -16, opacity: 0 }} animate={{ translateX: 0, opacity: 1 }} className="flex flex-col pb-8 min-h-full">
						<Separator className="mb-6" />

						<div className="flex flex-col max-h-64 justify-between px-6 overflow-x-hidden overflow-y-scroll">
							<h2 className="uppercase mb-4 text-muted-foreground text-xs">Chapters</h2>
							<div className="flex flex-col gap-3 mb-4">
								{chapters.map((chapter) => {
									return (
										<div key={chapter.id} className="flex gap-2 items-center text-muted-foreground">
											<FileText className="w-4 h-4" />
											<span>{chapter.title}</span>
										</div>
									);
								})}
							</div>
							<Button variant="outline" className="mt-4 w-full ml-auto" size="lg">
								New Chapter
							</Button>
						</div>

						<div className="bg-muted text-muted-foreground mt-auto">
							<Separator className="my-6" />

							<div className="px-6">
								<div className="flex gap-2 items-center text-muted-foreground">
									<LibraryBig className="w-4 h-4" />
									<span>Templates</span>
								</div>

								{/* <AnimatedText as="h2" className="font-serif text-sm font-black mb-3">
									Chapters
								</AnimatedText>
								<AnimatedText as="p" className="text-sm">
									Here you can see all sections of your documentation.
								</AnimatedText> */}
							</div>
						</div>
					</motion.div>
				</ResizablePanel>

				<ResizableHandle />

				<ResizablePanel className="h-screen pt-16 px-8">Two</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
