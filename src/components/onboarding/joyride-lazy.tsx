import type { Props } from 'react-joyride';
import { lazy, Suspense } from 'react';

// Lazy load Joyride to reduce initial bundle size
const Joyride = lazy(() => import('react-joyride').then(module => ({ default: module.default })));

/**
 * Lazy-loaded wrapper for Joyride to improve performance
 */
export function JoyrideLazy(props: Props) {
		return (
			<Suspense fallback={null}>
				<Joyride {...props} />
			</Suspense>
		);
	}
