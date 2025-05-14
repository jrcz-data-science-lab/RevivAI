import mermaid from 'mermaid';

// Initialize Mermaid with default settings
mermaid.initialize({
	startOnLoad: true,
	theme: 'dark',
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
	return result.svg
}

/**
 * Find all mermaid diagram  blocks in the markdown, and replace them with the rendered SVG
 * @param markdown - The markdown string to process
 * @returns - Returns the markdown string with rendered SVGs
 */
export async function renderMermaidInMarkdown(markdown: string) {
	// Regex to find ```mermaid code blocks
	const mermaidBlockRegex = /```mermaid\s+([\s\S]*?)```/g;

	let idx = 0;
	const replacements: Promise<[string, string]>[] = [];

	markdown.replace(mermaidBlockRegex, (match, code) => {
		const id = `mermaid-svg-${idx++}`;
		const svgPromise = renderMermaidCode(code.trim(), id)
			.then(svg => [match, svg])
			.catch(() => [match, match]);
		replacements.push(svgPromise as Promise<[string, string]>);
		return match;
	});

	const resolved = await Promise.all(replacements);

	let result = markdown;
	for (const [original, svg] of resolved) {
		result = result.replace(original, svg);
	}

	return result;
}