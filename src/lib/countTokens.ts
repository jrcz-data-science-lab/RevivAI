import { Tiktoken } from 'js-tiktoken/lite';
import o200kBase from 'js-tiktoken/ranks/o200k_base';

const enc = new Tiktoken(o200kBase);

/**
 * Count the number of tokens in a given input string.
 * @param text The input string to count tokens for.
 */
export function countTokens(text: string) {
	return enc.encode(text).length;
}
