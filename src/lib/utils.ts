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
export function getTokensCountColor(tokensCount: number, mediumThreshold = 90_000, highThreshold = 200_000) {
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
		const fileName = `./${encodeURI(title)}.md`;
		return `- [${title}](${fileName})`;
	});

	return toc.join('\n');
}
