import { createHighlighter, bundledLanguages } from 'shiki/bundle/web';
import { memo, useMemo, useState, useEffect } from 'react';
import { fromHighlighter } from '@shikijs/markdown-it';
import MarkdownIt from 'markdown-it';

// Initialize basic markdown-it instance
const md = MarkdownIt({ typographer: true, html: false });

// Code Highlighter initialization function
let highlighterReady = false;
async function initializeHighlighter() {
	if (highlighterReady) return md;

	const highlighter = await createHighlighter({
		langs: Object.keys(bundledLanguages),
		themes: ['material-theme-darker'],
	});

	const shiki = fromHighlighter(highlighter, { theme: 'material-theme-darker', defaultLanguage: 'javascript', fallbackLanguage: 'javascript' });
	md.use(shiki);
	highlighterReady = true;

	return md;
}

function ChatMarkdown({ children, ...props }: { children: string }) {
	const [markdownIt, setMarkdownIt] = useState<MarkdownIt>(md);

	useEffect(() => {
		initializeHighlighter().then(setMarkdownIt);
	}, []);

	const rendered = useMemo(() => {
		return markdownIt.render(children);
	}, [children, markdownIt]);

	return <div className="markdown prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: rendered }} {...props}></div>;
}

export default memo(ChatMarkdown);
