import { useMemo } from 'react';
import { useDebounce } from './useDebounce';

const { countTokens } = await import('../lib/countTokens');

/**
 * Hook to count the number of tokens in a given input string.
 * @param input The input string to count tokens for.
 * @param throttle The throttle time in milliseconds. Defaults to 0.
 */
export function useTokensCount(input: string, throttle = 0) {
	const debouncedInput = useDebounce(input, throttle);

	// Skip throttling if throttle is 0
	if (throttle === 0) return countTokens(debouncedInput);

	const tokensCount = useMemo(() => {
		return countTokens(debouncedInput);
	}, [debouncedInput]);

	return tokensCount;
}
