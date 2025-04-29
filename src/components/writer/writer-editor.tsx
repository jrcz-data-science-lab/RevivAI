import type { Chapter } from '@/hooks/useDb';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState } from 'react';
import ChatMarkdown from '../chat/chat-markdown';
import { linkPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo } from '@mdxeditor/editor';
import { headingsPlugin, codeBlockPlugin } from '@mdxeditor/editor';

interface WriterEditorProps {
	chapter: Chapter;
	onChange?: (chapter: Chapter) => void;
}

export function WriterEditor({ chapter, onChange }: WriterEditorProps) {
	const onContentChange = (value: string) => {
		if (!onChange) return;

		const firstHeading = value.match(/# (.*)/)?.[1]?.trim();

		onChange({
			...chapter,
			title: firstHeading ? firstHeading : chapter.title,
			description: value,
		});
	}

	return (
		<div className="flex flex-col gap-8 w-full">
			<div>
				<h1 className="text-xl font-serif font-black mb-2">Chapter Content</h1>
				<p className="text-md text-muted-foreground">
					Describe the content of the chapter. You can use markdown to format the text.
				</p>
{/* 
				<div className="flex flex-col gap-2 mt-6">
					<Label htmlFor="chapter-title" className="text-sm font-semibold">
						Chapter Title
					</Label>
					<Input
						id="chapter-title"
						placeholder="Chapter title"
						defaultValue={chapter.title}
						className="bg-background"
					/>
				</div> */}
			</div>

			<div className="w-full max-w-full py-6 border-t border-border">
				{/* <ChatMarkdown>{content}</ChatMarkdown> */}
				<MDXEditor
					onChange={(value) => onContentChange(value)}
					markdown={chapter.description}
					className="outline-none"
					contentEditableClassName="outline-none prose prose-neutral dark:prose-invert"
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
	);
}
