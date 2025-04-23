import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type ButtonProps = React.ComponentProps<'button'> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	round?: boolean;
	asChild?: boolean;
};

export function Button({
	className,
	variant = 'default',
	size = 'default',
	round = false,
	asChild = false,
	...props
}: ButtonProps) {
	const baseClasses =
		'inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap text-sm font-medium active:scale-95 transition-[color,box-shadow,scale] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0';

	const variantClasses = {
		default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
		destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90',
		outline: 'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
		secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
		ghost: 'hover:bg-accent hover:text-accent-foreground',
		link: 'text-primary underline-offset-4 hover:underline',
	}[variant];

	const sizeClasses = {
		default: 'h-9 px-4 py-2 has-[>svg]:px-3',
		sm: 'h-8 px-3 has-[>svg]:px-2.5',
		lg: 'h-10 px-6 has-[>svg]:px-4',
		icon: 'size-9',
	}[size];

	const roundClasses = round ? 'rounded-full' : 'rounded-md';

	const finalClasses = cn(baseClasses, variantClasses, sizeClasses, roundClasses, className);
	const Comp = asChild ? Slot : 'button';

	return <Comp data-slot="button" className={finalClasses} {...props} />;
}
