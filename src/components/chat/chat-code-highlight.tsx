import { type ReactNode, lazy, memo } from 'react';
import ShikiHighlighter, { type Element, isInlineCode } from 'react-shiki';

const ChatMermaidLazy = lazy(() => import('./chat-mermaid'));

interface CodeHighlightProps {
	className?: string;
	children?: ReactNode;
	node?: Element;
}

const CodeHighlight = ({ className, children, node }: CodeHighlightProps) => {
	const match = className?.match(/language-(\w+)/);
	const language = match ? match[1] : undefined;
	const isInline = node ? isInlineCode(node) : undefined;

	// Mermaid diagram rendering
	if (language === 'mermaid') {
		return <ChatMermaidLazy>{String(children)}</ChatMermaidLazy>;
	}

	// Is inline rendering
	if (isInline) {
		return <code className={className}>{String(children)}</code>;
	}

	// Shiki highlighter
	return (
		<ShikiHighlighter
			as={'div'}
			delay={150}
			language={language}
			className={className}
			addDefaultStyles={false}
			theme={'vitesse-dark'}
		>
			{String(children)}
		</ShikiHighlighter>
	);
};

export default memo(CodeHighlight);
