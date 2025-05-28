import Zoom from 'react-medium-image-zoom';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { renderMermaidCode, validateMermaidCode } from '@/lib/mermaid';

// Styles for image zooming
import '@/styles/medium-image-zoom.css';

interface ChatMermaidProps {
	children: string;
}

export default function ChatMermaid({ children }: ChatMermaidProps) {
	// Generate a unique ID for the Mermaid diagram
	const id = useMemo(() => `mermaid-${Math.random().toString(36).substring(2, 15)}`, []);

	const code = useDebounce(children, 150);
	const [diagramSVG, setDiagramSVG] = useState<string | null>(null);

	useEffect(() => {
		const renderMermaid = async (code: string) => {
			const valid = await validateMermaidCode(code);
			if (!valid) return;

			const svg = await renderMermaidCode(code, id);
			setDiagramSVG(svg);
		};

		if (code) renderMermaid(code);
	}, [code]);

	// If the diagram is not rendered yet, show the code as a fallback
	if (!diagramSVG) {
		return <div className="flex min-h-32 justify-center items-center">{children}</div>;
	}

	// If the diagram is rendered, show the SVG image
	return (
		<Zoom zoomMargin={16}>
			<img
				alt={id}
				src={`data:image/svg+xml;utf8,${encodeURIComponent(diagramSVG ?? '')}`}
				className="flex min-h-32 justify-center items-center"
			/>
		</Zoom>
	);
}
