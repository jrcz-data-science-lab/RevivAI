import { X } from 'lucide-react';
import type { TooltipRenderProps } from 'react-joyride';

export function OnboardingTooltip(props: TooltipRenderProps) {
	const { backProps, closeProps, continuous, index, primaryProps, skipProps, step, tooltipProps } = props;

	return (
		<div
			className="relative flex flex-col bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 gap-4 rounded-lg border p-6 shadow-lg duration-200 w-full max-w-md overflow-y-auto"
			{...tooltipProps}
		>
			<button
				className="absolute ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer"
				{...closeProps}
			>
				<X />
				<span className="sr-only">Close</span>
			</button>

			<div className="flex flex-col gap-2 text-center sm:text-left">
				{step.title && <h4 className="text-lg leading-none font-semibold tracking-tight">{step.title}</h4>}

				<div className="text-muted-foreground text-sm">{step.content}</div>
			</div>

			<div className="flex gap-2 sm:flex-row justify-center sm:justify-end w-full">
				<button
					className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
					{...skipProps}
				>
					{skipProps.title}
				</button>

				<div className="flex items-center gap-2">
					{index > 0 && (
						<button
							className="bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
							{...backProps}
						>
							{backProps.title}
						</button>
					)}
					{continuous && (
						<button
							className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
							{...primaryProps}
						>
							{primaryProps.title}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
