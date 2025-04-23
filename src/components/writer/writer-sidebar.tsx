import type { Chapter } from '@/lib/db';
import { useState } from 'react';
import { AnimatePresence, motion, Reorder } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Download, FileText, LibraryBig, Plus, Settings, Trash } from 'lucide-react';
import { WriterSidebarItem } from './writer-sidebar-item';
import type { Database } from '@/hooks/useDb';

// TODO: Fix Vertical Scroll overflow for chapters.

interface WriterSidebarProps {
	activeItemId: string | undefined;
	chapters: Chapter[] | undefined;
	onSelect: (id: string) => void;
	onReorder: (newOrder: Chapter[]) => void;
	onAddChapter: () => void;
	onRemoveChapter: (id: string) => void;
}

/**
 * Sidebar component for the Writer page.
 */
export function WriterSidebar({
	chapters,
	onReorder,
	activeItemId,
	onSelect,
	onAddChapter,
	onRemoveChapter,
}: WriterSidebarProps) {
	return (
		<div className="z-40 bg-muted border-r w-full max-w-64">
			<motion.div
				initial={{ translateX: -16, opacity: 0 }}
				animate={{ translateX: 0, opacity: 1 }}
				className="h-full flex flex-col text-sm overflow-hidden pt-16"
			>
				<div className="flex flex-col flex-none text-muted-foreground py-3">
					<div className="flex flex-col px-6">
						<WriterSidebarItem
							icon={LibraryBig}
							title={'Templates'}
							active={activeItemId === 'templates'}
							onClick={() => onSelect('templates')}
						/>
						<WriterSidebarItem
							icon={Download}
							title={'Export'}
							active={activeItemId === 'export'}
							onClick={() => onSelect('export')}
						/>
						<WriterSidebarItem
							icon={Settings}
							title={'Settings'}
							active={activeItemId === 'settings'}
							onClick={() => onSelect('settings')}
						/>
					</div>
				</div>

				<div className="flex flex-col flex-1 overflow-hidden relative">
					<div className="px-6 pt-6 pb-1.5 text-muted-foreground text-xs flex-none">Chapters</div>

					<div className="flex-1 overflow-y-auto px-6">
						{Array.isArray(chapters) && (
							<AnimatePresence initial={false}>
								<Reorder.Group
									axis="y"
									values={chapters}
									onReorder={onReorder}
									layoutScroll
									className="flex flex-col pb-8 overflow-hidden"
								>
									{chapters.map((chapter) => (
										<Reorder.Item
											key={chapter.id}
											value={chapter}
											transition={{ duration: 0.1 }}
											initial={{ opacity: 0, maxHeight: 0 }}
											animate={{ opacity: 1, maxHeight: 32 }}
											exit={{ opacity: 0, maxHeight: 0 }}
											className="relative flex h-8 gap-2 items-center group overflow-hidden"
										>
											<WriterSidebarItem
												icon={FileText}
												title={chapter.title}
												active={chapter.id === activeItemId}
												onClick={() => onSelect(chapter.id)}
												onDelete={() => onRemoveChapter(chapter.id)}
											/>
										</Reorder.Item>
									))}
								</Reorder.Group>
							</AnimatePresence>
						)}
					</div>

					<div className="flex-none p-3 bg-muted">
						<Button variant="outline" className="w-full" size="lg" onClick={onAddChapter}>
							<Plus className="h-4 w-4 mr-2" />
							New Chapter
						</Button>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
