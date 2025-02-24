import { memo, type ReactNode } from 'react';
import ShikiHighlighter, { isInlineCode, type Element } from 'react-shiki';
import { ChatMermaid } from './chat-mermaid';

interface CodeHighlightProps {
	className?: string;
	children?: ReactNode;
	node?: Element;
}

const CodeHighlight = ({ className, children, node, ...props }: CodeHighlightProps) => {
	const match = className?.match(/language-(\w+)/);
	const language = match ? match[1] : undefined;
    const isInline = node ? isInlineCode(node) : undefined;

	if (language === 'mermaid') {
		return <ChatMermaid>{String(children)}</ChatMermaid>;
	}

    if (isInline) {
        return (
			<code className={className}>
				{String(children)}
			</code>
		);
    }

	return (
		<ShikiHighlighter language={language} delay={300} as={'div'} addDefaultStyles={false} theme={'material-theme-darker'} className={className}>
			{String(children)}
		</ShikiHighlighter>
	);
};

export default memo(CodeHighlight);
