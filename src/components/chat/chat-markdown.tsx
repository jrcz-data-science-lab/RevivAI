import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import CodeHighlight from './chat-code-highlight';
import { rehypeInlineCodeProperty } from 'react-shiki';

const ChatMarkdown = ({ children, ...props }: { children: string }) => {
	return (
		<div className="markdown prose dark:prose-invert" {...props}>
			<ReactMarkdown rehypePlugins={[rehypeInlineCodeProperty]} components={{ code: CodeHighlight }} disallowedElements={['img', 'hr']}>
				{children.trim()}
			</ReactMarkdown>
		</div>
	);
};

export default memo(ChatMarkdown);
