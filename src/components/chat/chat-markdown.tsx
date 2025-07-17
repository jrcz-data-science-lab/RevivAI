import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { rehypeInlineCodeProperty } from 'react-shiki';
import remarkGfm from 'remark-gfm';
import CodeHighlight from './chat-code-highlight';

interface ChatMarkdownProps {
	children: string;
}

const ChatMarkdown = ({ children }: ChatMarkdownProps) => {
	return (
		<div className="markdown prose prose-neutral prose-pre:bg-[#121212] dark:prose-invert text-md max-w-full">
			<ReactMarkdown
				rehypePlugins={[rehypeInlineCodeProperty, remarkGfm]}
				components={{ code: CodeHighlight }}
				disallowedElements={['img', 'hr']}
			>
				{children.trim()}
			</ReactMarkdown>
		</div>
	);
};

export default memo(ChatMarkdown);
