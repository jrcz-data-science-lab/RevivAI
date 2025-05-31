import type { Props } from 'react-joyride';
import { lazy, Suspense } from 'react';

// Lazy load Joyride to reduce initial bundle size
const Joyride = lazy(() => import('react-joyride'));

export { EVENTS } from 'react-joyride';
export type { CallBackProps, Step } from 'react-joyride';

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
