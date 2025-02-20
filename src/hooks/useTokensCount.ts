import { useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { Tiktoken } from 'js-tiktoken/lite';
import o200kBase from 'js-tiktoken/ranks/o200k_base';

const enc = new Tiktoken(o200kBase);

/**
 * Hook to count the number of tokens in a given input string.
 * @param input The input string to count tokens for.
 * @param throttle The throttle time in milliseconds. Defaults to 0.
 */
export function useTokensCount(input: string, throttle = 0) {
    const debouncedInput = useDebounce(input, throttle);

    // Skip throttling if throttle is 0
    if (throttle === 0) return enc.encode(debouncedInput).length;

    const tokensCount = useMemo(() => {
		return enc.encode(debouncedInput).length;
	}, [debouncedInput]);

    return tokensCount;
}
