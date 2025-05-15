import type { Chapter } from '@/hooks/useDb';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
	MDXEditor,
	linkPlugin,
	listsPlugin,
	quotePlugin,
	headingsPlugin,
	codeBlockPlugin,
	thematicBreakPlugin,
	markdownShortcutPlugin,
} from '@mdxeditor/editor';
import { useCallback } from 'react';
import { AnimatedText } from '../ui/animated-text';

interface WriterEditorProps {
	chapter: Chapter;
	onChange?: (chapter: Chapter) => void;
}

/**
 * Editor component for the Writer page.
 */
export function WriterEditor({ chapter, onChange }: WriterEditorProps) {
	const onOutlineChange = useCallback(
		(value: string) => {
			if (!onChange) return;

			onChange({
				...chapter,
				outline: value,
			});
		},
		[onChange, chapter],
	);

	const onTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!onChange) return;

			onChange({
				...chapter,
				title: e.target.value,
			});
		},
		[onChange, chapter],
	);

	return (
		<div className="flex flex-col gap-8 w-full">
			<div>
				<h1 className="text-xl font-serif font-black mb-1.5">Chapter Description</h1>
				<p className="text-md text-muted-foreground">
					Describe the content of the chapter using Markdown. Title will be used as a file name of the generated
					file.
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="chapter-title" className="text-sm font-semibold">
					Title
				</Label>

				<Input
					id="chapter-title"
					placeholder="Chapter title"
					value={chapter.title}
					onChange={onTitleChange}
					className="bg-background"
				/>
			</div>

			<div className="flex flex-col gap-3">
				<Label className="text-sm font-semibold">Outline</Label>
				<div className="border border-input rounded-md shadow-xs focus-within:ring-4 focus-within:outline-1 transition-all selection:text-primary-foreground selection:bg-primary ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 min-h-32">
					<MDXEditor
						onChange={onOutlineChange}
						markdown={chapter.outline ?? ''}
						onError={console.error}
						contentEditableClassName="outline-none prose prose-neutral dark:prose-invert w-full max-w-full text-sm p-3"
						plugins={[
							headingsPlugin(),
							listsPlugin(),
							linkPlugin(),
							quotePlugin(),
							markdownShortcutPlugin(),
							thematicBreakPlugin(),
							codeBlockPlugin(),
						]}
					/>
				</div>
			</div>
		</div>
	);
}
