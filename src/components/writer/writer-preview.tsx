import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GeneratedFile } from '@/hooks/useDb';
import { rehypeInlineCodeProperty } from 'react-shiki';
import CodeHighlight from '../chat/chat-code-highlight';

interface WriterPreviewProps {
	open: boolean;
	onClose: () => void;
	files: GeneratedFile[];
}

export function WriterPreview({ open, onClose, files }: WriterPreviewProps) {
	const markdownElement = useRef<HTMLDivElement>(null);
	const [selectedFileId, setSelectedFileId] = useState<string | undefined>();

	if (!selectedFileId && files.length > 0) {
		const readme = files.find((f) => f.fileName === 'README.md');
		readme ? setSelectedFileId(readme.id) : setSelectedFileId(files[0]?.id);
	}

	// Currently selected file
	const selectedFile = useMemo(() => files.find((f) => f.id === selectedFileId), [files, selectedFileId]);

	// Handle link clicks in markdown
	const handleLinkClick = useCallback(
		(href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();

			const fileName = decodeURIComponent(href.split('/').pop() || '');
			const file = files.find((f) => f.fileName === fileName);

			if (file) {
				setSelectedFileId(file.id);
			} else {
				window.open(href, '_blank');
			}
		},
		[files],
	);

	// Sort files, prioritizing README.md
	const sortedFiles = useMemo(
		() =>
			files.sort((a, b) => {
				if (a.fileName === 'README.md') return -1;
				return 0;
			}),
		[files],
	);

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="p-0 flex flex-row overflow-hidden h-full w-full max-w-6xl">
				<aside className="w-64 border-r bg-muted h-full flex flex-col">
					<DialogHeader className="p-4 border-b">
						<DialogTitle>Preview</DialogTitle>
					</DialogHeader>
					<ScrollArea className="flex-1">
						<ul className="py-2">
							{sortedFiles.map((file) => (
								<li key={file.id}>
									<Button
										variant="link"
										className={cn(
											'w-full justify-start rounded-none text-muted-foreground',
											selectedFileId === file.id && 'text-foreground',
										)}
										onClick={() => setSelectedFileId(file.id)}
									>
										{file.fileName}
									</Button>
								</li>
							))}
						</ul>
					</ScrollArea>
				</aside>

				<main className="flex-1 h-full w-full bg-background overflow-y-auto">
					<div ref={markdownElement} className="pl-8 p-16 prose prose-neutral prose-pre:bg-[#121212] dark:prose-invert">
						{selectedFile ? (
							<ReactMarkdown
								remarkPlugins={[rehypeInlineCodeProperty, remarkGfm]}
								components={{
									code: CodeHighlight,
									a: ({ href = '', children, ...props }) => (
										<a
											href={href}
											{...props}
											onClick={(e) => handleLinkClick(href, e)}
											className="text-primary underline cursor-pointer"
										>
											{children}
										</a>
									),
								}}
							>
								{selectedFile.content || 'No content.'}
							</ReactMarkdown>
						) : (
							<div className="text-muted-foreground">No file selected.</div>
						)}
					</div>
				</main>
			</DialogContent>
		</Dialog>
	);
}
