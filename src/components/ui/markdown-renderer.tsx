import { marked } from 'marked';
import { useMemo } from 'react'

export function MarkdownRenderer({ children }: { children: string }) {
    const rendered = useMemo(() => {
        return marked(children, { async: false });
    }, [children])

    return <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: rendered }}></div>;
}