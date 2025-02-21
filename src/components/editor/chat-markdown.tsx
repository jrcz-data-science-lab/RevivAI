import { marked } from 'marked';
import { memo, useMemo } from 'react'

function ChatMarkdown({ children }: { children: string }) {
    const rendered = useMemo(() => {
        return marked(children, { async: false });
    }, [children])

    return <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: rendered }}></div>;
}

export default memo(ChatMarkdown);