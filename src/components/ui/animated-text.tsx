import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

interface AnimatedTextProps extends Omit<React.ComponentProps<'h1'>, 'as'> {
	as?: ElementType;
	speed?: number;
	delay?: number;
}

export function AnimatedText({ as: Element = 'p', delay = 0, speed = 0.6, className, children, ...props }: AnimatedTextProps) {
	if (typeof children !== 'string') return <></>;

	const words = children.split(' ');

	return (
		<Element className={cn('flex gap-1.5 w-full flex-wrap', className)} {...props}>
			{words.map((word, i) => (
				<span className="overflow-hidden" key={i}>
					<motion.span
						className="inline-block min-w-fit"
						initial={{ translateY: 64 }}
						animate={{ translateY: 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: speed, type: 'spring', delay: delay + i * 0.02 }}
					>
						{word}
					</motion.span>
				</span>
			))}
		</Element>
	);
}
