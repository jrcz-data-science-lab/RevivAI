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
export function renderMermaidCode(code: string, id: string) {
    return mermaid.render(id, code);
}
