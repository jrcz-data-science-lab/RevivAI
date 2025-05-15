import type { GeneratedFile } from '@/hooks/useDb';
import mermaid from 'mermaid';

// Initialize Mermaid with default settings
mermaid.initialize({
	theme: 'neutral',
	darkMode: true,
});

/**
 * Function to validate Mermaid code
 * @param code - The Mermaid code to validate
 * @returns - Returns true if the code is valid, false otherwise
 */
export function validateMermaidCode(code: string) {
	return mermaid.parse(code, { suppressErrors: true });
}

/**
 * Function to render Mermaid code
 * @param code - The Mermaid code to render
 * @param id - The ID for the SVG element
 * @returns - Returns the rendered SVG as a string
 */
export async function renderMermaidCode(code: string, id: string) {
	const result = await mermaid.render(id, code);
	return result.svg;
}

/**
 * Find all mermaid diagram blocks in the markdown, and replace them with image links.
 * Returns an object with image paths as keys and SVG code as values.
 * TODO: Color the SVGs. Export as separate files.
 * @param markdown - The markdown string to process
 */
export async function renderMermaidInMarkdown(markdown: string) {
	const matches = Array.from(markdown.matchAll(/```mermaid\s+([\s\S]*?)```/g));
	let result = markdown;

	for (let i = 0; i < matches.length; i++) {
		const [fullBlock, code] = matches[i];

		try {
			const svg = await renderMermaidCode(code, `diagram-${i}`);
			console.log('Rendered SVG:', svg);
			result = result.replace(fullBlock, svg);
		} catch {
			console.error('Error rendering Mermaid diagram:', code);
			// Skip if rendering fails, leave the original block
		}
	}

	return result;
}
