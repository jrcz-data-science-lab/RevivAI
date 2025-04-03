import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple tailwind class names into a single string.
 * @param inputs The class names to combine.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
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
