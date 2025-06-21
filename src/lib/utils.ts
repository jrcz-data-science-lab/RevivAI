import type { Chapter } from '@/hooks/useWriter';
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

const TAILWIND_COLORS = [
	'bg-red-500',
	'bg-orange-500',
	'bg-amber-500',
	'bg-yellow-500',
	'bg-lime-500',
	'bg-green-500',
	'bg-emerald-500',
	'bg-teal-500',
	'bg-cyan-500',
	'bg-sky-500',
	'bg-blue-500',
	'bg-indigo-500',
	'bg-violet-500',
	'bg-purple-500',
	'bg-fuchsia-500',
	'bg-pink-500',
	'bg-rose-500',
];

/**
 * Converts text to a tailwind color string.
 * @param text The input text.
 * @returns A tailwind color class (e.g. 'blue-500').
 */
export function colorHash(text: string): string {
	let hash = 0;

	for (let i = 0; i < text.length; i++) {
		hash = (hash << 5) - hash + text.charCodeAt(i);
		hash |= 0; // Convert to 32bit integer
	}

	const color = TAILWIND_COLORS[Math.abs(hash) % TAILWIND_COLORS.length];
	return color;
}
