import { memo } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import CodeHighlight from './chat-code-highlight';
import { rehypeInlineCodeProperty } from 'react-shiki';

const ChatMarkdown = ({ children, ...props }: { children: string }) => {
	return (
		<div className="markdown prose dark:prose-invert text-md max-w-full" {...props}>
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
