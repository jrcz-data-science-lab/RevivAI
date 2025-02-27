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
