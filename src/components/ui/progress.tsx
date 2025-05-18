import { useEffect, useRef, useState } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
	value?: number;
}

function Progress({ className, value, ...props }: ProgressProps) {
	const [extrapolatedValue, setExtrapolatedValue] = useState(value || 0);
	const prevValueRef = useRef<number | undefined>(value);
	const prevTimeRef = useRef<number>(Date.now());

	useEffect(() => {
		if (value === undefined) return;

		const now = Date.now();
		const prevValue = prevValueRef.current ?? value;
		const prevTime = prevTimeRef.current;

		const deltaValue = value - prevValue;
		const deltaTime = now - prevTime;

		if (deltaValue > 0 && deltaTime > 0) {
			// Estimate rate of change per ms
			const rate = deltaValue / deltaTime;

			let rafId: number;
			const start = now;
			const currentValue = value;

			const animate = () => {
				const elapsed = Date.now() - start;
				const nextValue = Math.min(100, currentValue + rate * elapsed);
				if (nextValue <= currentValue || currentValue >= 95) return;

				setExtrapolatedValue(nextValue);
				if (nextValue < 100 && rate > 0) {
					rafId = requestAnimationFrame(animate);
				}
			};

			setExtrapolatedValue(value);
			rafId = requestAnimationFrame(animate);

			return () => cancelAnimationFrame(rafId);
		}

		setExtrapolatedValue(value);
		prevValueRef.current = value;
		prevTimeRef.current = now;
	}, [value]);

	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="bg-primary h-full w-full flex-1 transition-transform ease-linear duration-2000"
				style={{ transform: `translateX(-${100 - (extrapolatedValue || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
