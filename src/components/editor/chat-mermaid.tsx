import { useEffect, useMemo, useState } from 'react';
import mermaid from 'mermaid';
import { useDebounce } from '@/hooks/useDebounce';

mermaid.initialize({ startOnLoad: true, theme: 'neutral', darkMode: true });

interface ChatMermaidProps {
	children: string;
}

export function ChatMermaid({ children }: ChatMermaidProps) {
    const code = useDebounce(children, 300);
	const [rendered, setRendered] = useState<string | null>(null);

	useEffect(() => {
		const renderMermaid = async (code: string) => {
			const valid = await mermaid.parse(code, { suppressErrors: true });
			if (!valid) return;

			const result = await mermaid.render('mermaid', code);
			setRendered(result.svg);
		}

		if (code) renderMermaid(code);
	}, [code]);


	return <div className={`flex justify-center items-center min-h-32`} dangerouslySetInnerHTML={{ __html:  rendered ?? children }} />;
}
