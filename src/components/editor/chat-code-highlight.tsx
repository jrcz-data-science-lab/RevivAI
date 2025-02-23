import { memo, type ReactNode } from 'react';
import ShikiHighlighter, { isInlineCode, type Element } from 'react-shiki';

interface CodeHighlightProps {
	className?: string | undefined;
	children?: ReactNode | undefined;
	node?: Element | undefined;
}

const CodeHighlight = ({ className, children, node, ...props }: CodeHighlightProps) => {
	const match = className?.match(/language-(\w+)/);
	const language = match ? match[1] : undefined;
    const isInline = node ? isInlineCode(node) : undefined;

    if (isInline) {
        return (
			<code className={className} {...props}>
				{String(children)}
			</code>
		);
    }

	return (
		<ShikiHighlighter language={language} delay={100} as={'div'} addDefaultStyles={false} theme={'material-theme-darker'} {...props}>
			{String(children)}
		</ShikiHighlighter>
	);
};

export default memo(CodeHighlight);
