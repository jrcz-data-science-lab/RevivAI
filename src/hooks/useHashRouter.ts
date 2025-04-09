import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing URL hash routing
 * @param defaultHash Default hash value to use when the URL hash is empty
 * @returns Object containing the current hash value and functions to update it
 */
export function useHashRouter(defaultHash: string) {
	// Initialize state with current hash or default value
	const [hash, setHashState] = useState<string>(() => {
		const currentHash = window.location.hash.slice(1);
		return currentHash || defaultHash;
	});

	// Update the URL when hash changes
	const setHash = useCallback(
		(newHash: string) => {
			if (newHash !== hash) {
				window.location.hash = newHash;
				setHashState(newHash);
			}
		},
		[hash],
	);

	// Clear the hash from the URL
	const clearHash = useCallback(() => {
		window.history.pushState('', document.title, window.location.pathname + window.location.search);
		setHashState(defaultHash);
	}, []);

	// Listen for hash changes in the URL
	useEffect(() => {
		const controller = new AbortController();

		// Add event listener with AbortSignal
		window.addEventListener(
			'hashchange',
			() => {
				const newHash = window.location.hash.slice(1);
				setHashState(newHash || defaultHash);
			},
			{ signal: controller.signal },
		);

		return () => controller.abort();
	}, [defaultHash]);

	return {
		hash,
		setHash,
		clearHash,
	};
}
