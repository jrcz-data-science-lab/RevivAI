import { AnimatePresence, motion, Reorder } from 'motion/react';
import { Download, FileText, LibraryBig, Settings, Sparkles } from 'lucide-react';
import { WriterSidebarItem } from './writer-sidebar-item';
import type { Chapter } from '@/hooks/useDb';
import type { WriterItemId } from '@/hooks/useWriter';

interface WriterSidebarProps {
	activeItemId: WriterItemId | undefined;
	chapters: Chapter[] | undefined;
	onSelect: (id: WriterItemId) => void;
	onReorder: (newOrder: Chapter[]) => void;
	onRemoveChapter: (id: WriterItemId) => void;
}

/**
 * Sidebar component for the Writer page.
 */
export function WriterSidebar({ chapters, onReorder, activeItemId, onSelect, onRemoveChapter }: WriterSidebarProps) {
	return (
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
						icon={Sparkles}
						title={'Generate'}
						active={activeItemId === 'generate'}
						onClick={() => onSelect('generate')}
					/>
				</div>
			</div>

			<div className="flex flex-col flex-1 overflow-hidden relative">
				<div className="px-6 pt-6 pb-1.5 text-muted-foreground text-xs flex-none uppercase">Table of Contents</div>

				<div className="flex-1 overflow-y-auto px-6 pb-16">
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
			</div>
		</motion.div>
	);
}
