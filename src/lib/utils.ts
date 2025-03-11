import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Tiktoken } from 'js-tiktoken/lite';
import o200kBase from 'js-tiktoken/ranks/o200k_base';

/**
 * Combine multiple tailwind class names into a single string.
 * @param inputs The class names to combine.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


const enc = new Tiktoken(o200kBase);

/**
 * Count the number of tokens in a given input string.
 * @param text The input string to count tokens for.
 */
export function countTokens(text: string) {
	return enc.encode(text).length;
}

/**
 * Build a tree structure from a list of files.
 * @param fileList The list of files to build a tree from.
 * @returns The tree structure.
 */
export function buildTree(fileList: { path: string; content: string }[]) {
	const tree: any = {};

	fileList.forEach(({ path, content }) => {
		const parts = path.split('/');
		let current = tree;

		parts.forEach((part, index) => {
			if (!current[part]) {
				current[part] = index === parts.length - 1 ? { content } : {};
			}
			current = current[part];
		});
	});

	return tree;
}
