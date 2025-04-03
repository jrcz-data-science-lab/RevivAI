import { useEffect, useRef, useState } from 'react';

/**
 * A hook that returns a debounced version of the provided value.
 * @param value Value to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const lastRun = useRef<number>(Date.now());

	if (delay <= 0) return value;

	useEffect(() => {
		const updateValue = (value: T) => {
			setDebouncedValue(value);
			lastRun.current = Date.now();
		};

		// Run immediately
		if (Date.now() - lastRun.current > delay) {
			updateValue(value);
			return;
		}

		// Timer before running
		const timeoutId = setTimeout(() => updateValue(value), delay);
		return () => clearTimeout(timeoutId);
	}, [value, delay]);

	return debouncedValue;
}
