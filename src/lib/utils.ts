import type { Chapter } from '@/hooks/useDb';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple tailwind class names into a single string.
 * @param inputs The class names to combine.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Get the tailwind color class for the given tokens count.
 * @param tokensCount The number of tokens.
 * @param mediumThreshold The threshold for medium tokens count.
 * @param highThreshold The threshold for high tokens count.
 * @returns The tailwind color class.
 */
export function getTokensCountColor(tokensCount: number, mediumThreshold = 60_000, highThreshold = 100_000) {
	if (tokensCount > highThreshold) return 'text-destructive';
	if (tokensCount > mediumThreshold) return 'text-amber-500';
	return '';
}

/**
 * Create a table of contents prompt for the given chapters.
 * @param chapters The list of chapters.
 * @returns The table of contents prompt.
 */
export function createTOCPrompt(chapters: Chapter[]) {
	const toc = chapters.map((chapter) => {
		const title = chapter.title.trim();
		const fileName = `./${title}.md`;
		return `- [${title}](${fileName})`;
	});

	return `# Table of Contents\n\n${toc.join('\n')}`;
}

/**
 * Download a file with the given filename and blob data.
 * @param filename The name of the file to download.
 * @param blob The blob data to download.
 */
export function downloadFile(filename: string, blob: Blob) {
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = filename;
	
	try {
		document.body.appendChild(a);
		a.click();
	} finally {
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}
