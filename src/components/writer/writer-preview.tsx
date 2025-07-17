import type { GeneratedFile } from '@/hooks/useWriter';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { rehypeInlineCodeProperty } from 'react-shiki';
import remarkGfm from 'remark-gfm';
import CodeHighlight from '../chat/chat-code-highlight';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Switch } from '../ui/switch';

interface WriterPreviewProps {
	open: boolean;
	onClose: () => void;
	files: GeneratedFile[];
}

export function WriterPreview({ open, onClose, files }: WriterPreviewProps) {
	const mainRef = useRef<HTMLDivElement>(null);

	const [renderMarkdown, setRenderMarkdown] = useState(true);
	const [selectedFileId, setSelectedFileId] = useState<string | undefined>();

	// Scroll to top when selected file changes
	useEffect(() => {
		if (!mainRef.current) return;
		mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
	}, [selectedFileId]);

	// Automatically select the first file if no file is selected
	useEffect(() => {
		const readme = files.find((f) => f.fileName === 'README.md');
		readme ? setSelectedFileId(readme.id) : setSelectedFileId(files[0]?.id);
	}, [open]);

	// Currently selected file
	const selectedFile = useMemo(() => files.find((f) => f.id === selectedFileId), [files, selectedFileId]);

	// Sort files, prioritizing README.md
	const sortedFiles = useMemo(
		() =>
			files.sort((a, b) => {
				if (a.fileName === 'README.md') return -1;
				return 0;
			}),
		[files],
	);

	// Handle link clicks in markdown
	const handleLinkClick = useCallback(
		(href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();

			// If link to the chapter
			const fileName = decodeURIComponent(href.split('/').pop() || '');
			const file = files.find((f) => f.fileName === fileName);
			if (file) {
				setSelectedFileId(file.id);
				return;
			}

			// If link to the heading
			if (href.startsWith('#') && mainRef.current) {
				const headingName = href.slice(1);
				const headings = mainRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');

				for (const heading of headings) {
					if (heading.innerHTML.toLowerCase() === headingName.toLowerCase()) {
						heading.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
						return;
					}
				}
			}
		},
		[files],
	);

	/**
	 * Render the sidebar with a list of files
	 * @param files - The list of files to render
	 */
	const renderSidebar = (files: GeneratedFile[]) => {
		return (
			<ul className="py-2">
				{files.map((file) => (
					<li key={file.id}>
						<Button
							variant="link"
							onClick={() => setSelectedFileId(file.id)}
							className={cn(
								'w-full justify-start rounded-none text-muted-foreground',
								selectedFileId === file.id && 'text-foreground',
								file.status === 'pending' && 'animate-pulse',
								file.status === 'failed' && 'text-destructive',
							)}
						>
							{file.fileName}
						</Button>
					</li>
				))}
			</ul>
		);
	};

	/**
	 * Render a link in markdown
	 * @param href - The URL of the link
	 * @param children - The content of the link
	 */
	const MarkdownLink = ({ href = '', children, ...props }: { href?: string; children?: React.ReactNode }) => {
		return (
			<a
				href={href}
				{...props}
				onClick={(e) => handleLinkClick(href, e)}
				className="text-primary underline cursor-pointer"
			>
				{children}
			</a>
		);
	};

	/**
	 * Render content of the file
	 * @param file - The file to render
	 */
	const renderFileContent = (file: GeneratedFile | undefined) => {
		if (!file) return <span className="text-muted-foreground">No file selected.</span>;
		if (file.status === 'pending') return <span className="animate-pulse">Generation in progress...</span>;
		if (file.status === 'failed') return <span className="text-destructive">File generation failed.</span>;
		if (!file.content) return <span className="text-muted-foreground">File is empty.</span>;

		if (!renderMarkdown) {
			return <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words">{file.content}</pre>;
		}

		return (
			<div className="prose prose-neutral prose-pre:bg-[#121212] dark:prose-invert">
				<ReactMarkdown
					key={file.id}
					remarkPlugins={[rehypeInlineCodeProperty, remarkGfm]}
					components={{ code: CodeHighlight, a: MarkdownLink }}
				>
					{file.content}
				</ReactMarkdown>
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="p-0 flex flex-row overflow-hidden h-full w-full max-w-6xl">
				<aside className="w-64 border-r bg-muted h-full flex flex-col">
					<DialogHeader className="p-4 border-b">
						<DialogTitle>Preview</DialogTitle>
					</DialogHeader>
					<ScrollArea className="flex-1">{renderSidebar(sortedFiles)}</ScrollArea>
					<div className="p-4">
						<div className="flex justify-between items-center">
							<Label className="text-sm font-semibold" htmlFor="render-markdown">
								Render Markdown
							</Label>
							<Switch id="render-markdown" checked={renderMarkdown} onCheckedChange={setRenderMarkdown} />
						</div>
					</div>
				</aside>

				<main ref={mainRef} className="flex-1 h-full w-full bg-background overflow-y-auto">
					<div className="pl-8 p-16">{renderFileContent(selectedFile)}</div>
				</main>
			</DialogContent>
		</Dialog>
	);
}
