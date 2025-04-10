import type { Chapter } from '@/lib/db';
import { useState } from 'react';
import { AnimatePresence, motion, Reorder } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { FileText, LibraryBig, Plus, Settings, Trash } from 'lucide-react';

interface WriterSidebarProps {
	chapters: Chapter[] | undefined;
	setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>;
	selectedChapterId: string | undefined;
	setSelectedChapterId: React.Dispatch<React.SetStateAction<string | undefined>>;
	addChapter: () => void;
	removeChapter: (id: string) => void;
}

export function WriterSidebar({ chapters, setChapters, selectedChapterId, setSelectedChapterId, addChapter, removeChapter }: WriterSidebarProps) {
	return (
		<div className="bg-muted border-r w-full max-w-64">
			<motion.div
				initial={{ translateX: -16, opacity: 0 }}
				animate={{ translateX: 0, opacity: 1 }}
				className="h-full flex flex-col text-sm overflow-hidden pt-16"
			>
				<div className="flex flex-col flex-none text-muted-foreground py-3">
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
						{Array.isArray(chapters) && (
							<AnimatePresence initial={false}>
								<Reorder.Group axis="y" values={chapters} onReorder={setChapters} layoutScroll className="flex flex-col pb-8 overflow-hidden">
									{chapters.map((chapter) => {
										const active = chapter.id === selectedChapterId;

										return (
											<Reorder.Item
												key={chapter.id}
												value={chapter}
												transition={{ duration: 0.1 }}
												initial={{ opacity: 0, maxHeight: 0 }}
												animate={{ opacity: 1, maxHeight: 32 }}
												exit={{ opacity: 0, maxHeight: 0 }}
												className="relative flex h-8 gap-2 items-center group overflow-hidden"
											>
												<button
													type="button"
													onClick={() => setSelectedChapterId(chapter.id)}
													className={cn(
														'flex min-h-8 gap-2 items-center transition-all duration-100',
														active ? 'text-foreground pl-1' : 'text-muted-foreground hover:pl-1 cursor-pointer',
													)}
												>
													<FileText className="h-4" />
													<span className="w-full">{chapter.title}</span>
												</button>

												<div className="flex items-center h-8 absolute top-0 right-0 opacity-0 transition-all group-hover:opacity-100">
													<button type="button" onClick={() => removeChapter(chapter.id)}>
														<Trash className="h-4 hover:text-destructive cursor-pointer" />
													</button>
												</div>
											</Reorder.Item>
										);
									})}
								</Reorder.Group>
							</AnimatePresence>
						)}
					</div>

					<div className="flex-none p-3 bg-muted">
						<Button variant="outline" className="w-full" size="lg" onClick={addChapter}>
							<Plus className="h-4 w-4 mr-2" />
							New Chapter
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
