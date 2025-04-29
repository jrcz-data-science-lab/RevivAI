import type { Chapter } from '@/hooks/useDb';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useState } from 'react';
import ChatMarkdown from '../chat/chat-markdown';
import { linkPlugin, listsPlugin, markdownShortcutPlugin, MDXEditor, quotePlugin } from '@mdxeditor/editor';
import { headingsPlugin, codeBlockPlugin } from '@mdxeditor/editor';

interface WriterEditorProps {
	chapter: Chapter;
}

export function WriterEditor({ chapter }: WriterEditorProps) {
	const [content, setContent] = useState<string>(chapter.content);

	return (
		<div className="flex flex-col gap-8 w-full">
			{/* <div className="flex flex-col space-y-6 border border-border p-6 rounded-lg bg-muted">
				<div className="flex flex-col gap-2">
					<Label htmlFor="chapter-title" className="text-sm font-semibold">
						Title
					</Label>
					<Input
						id="chapter-title"
						placeholder="Chapter title"
						defaultValue={chapter.title}
						className="bg-background"
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="chapter-title" className="text-sm font-semibold">
						Chapter Description
					</Label>

					<Textarea placeholder="" defaultValue={chapter.description} className="bg-background" />
				</div>

				<div className="w-full flex justify-end">
					<Button>Generate Chapter</Button>
				</div>
			</div> */}

				<div>
					<h1 className="text-xl font-serif font-black">Chapter Content</h1>
					<p className="text-md text-muted-foreground">
						Describe the content of the chapter. You can use markdown to format the text.
					</p>
				</div>
			<div className="w-full max-w-full">

				{/* <ChatMarkdown>{content}</ChatMarkdown> */}
				<MDXEditor
					markdown={chapter.description}
					className='outline-none'
					contentEditableClassName='outline-none prose dark:prose-invert'
					plugins={[headingsPlugin(), listsPlugin(), linkPlugin(), quotePlugin(), markdownShortcutPlugin()]}
				/>
			</div>
		</div>
	);
}
