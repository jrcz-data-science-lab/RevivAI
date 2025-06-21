import { Tiktoken } from 'js-tiktoken/lite';
let encoder: Tiktoken;

/**
 * Count the number of tokens in a given input string.
 * @param text The input string to count tokens for.
 */
export function countTokens(text: string) {
	if (encoder) return encoder.encode(text).length;
	return Math.ceil(text.length / 4); // Approximation: 1 token ~ 4 characters
}

/**
 * Upgrade the token model to count tokens more accurately.
 * Tokenizing model quite heavy, so no need to load it until it's needed.
 */
export function upgradeTokenModel() {
	if (encoder) return;

	import('js-tiktoken/ranks/o200k_base').then((module) => {
		encoder = new Tiktoken(module.default);
	});
}
