import { memo, type ReactNode } from 'react';
import ShikiHighlighter, { type Element, isInlineCode } from 'react-shiki';
import { ChatMermaid } from './chat-mermaid';
import { useTheme } from '../../hooks/useTheme';

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
		return <ChatMermaid>{String(children)}</ChatMermaid>;
	}

	// Is inline rendering
	if (isInline) {
		return (
			<code className={className}>
				{String(children)}
			</code>
		);
	}

	// Shiki highlighter
	return (
		<ShikiHighlighter
			language={language}
			delay={300}
			as={'div'}
			addDefaultStyles={false}
			theme={'vitesse-dark'}
			className={className}
		>
			{String(children)}
		</ShikiHighlighter>
	);
};

export default memo(CodeHighlight);
