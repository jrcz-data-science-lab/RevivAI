import type * as React from 'react';
import { cn } from '@/lib/utils';

type AlertVariant = 'default' | 'destructive';

type AlertProps = React.ComponentProps<'div'> & {
	variant?: AlertVariant;
};

function Alert({ className, variant = 'default', ...props }: AlertProps) {
	const baseClasses =
		'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current';

	const variantClasses = {
		default: 'bg-background text-foreground',
		destructive: 'text-destructive *:data-[slot=alert-description]:text-destructive/60 [&>svg]:text-current border-destructive bg-red-500/5',
	}[variant];

	return <div data-slot="alert" role="alert" className={cn(baseClasses, variantClasses, className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="alert-title" className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-description"
			className={cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', className)}
			{...props}
		/>
	);
}

export { Alert, AlertDescription, AlertTitle };
