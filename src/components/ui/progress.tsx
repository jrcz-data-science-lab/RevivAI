import { useEffect, useRef, useState } from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
	value?: number;
}

function Progress({ className, value, ...props }: ProgressProps) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', className)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="bg-primary h-full w-full flex-1 transition-transform ease-out duration-[5s]"
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
