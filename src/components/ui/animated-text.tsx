import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

interface AnimatedTextProps extends Omit<React.ComponentProps<'h1'>, 'as'> {
	as?: ElementType;
	delay?: number;
}

export function AnimatedText({ as: Element = 'p', delay = 0, className, children, ...props }: AnimatedTextProps) {
	if (typeof children !== 'string') return <></>;

	return (
		<Element className={cn('flex gap-1.5 w-full flex-wrap', className)} {...props}>
			{children.split(' ').map((word, i) => (
				<span className="overflow-hidden" key={i}>
					<motion.span
						className="inline-block min-w-fit"
						initial={{ translateY: 64 }}
						animate={{ translateY: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6, type: 'spring', delay: delay + (i * 0.025) }}
					>
						{word}
					</motion.span>
				</span>
			))}
		</Element>
	);
}
