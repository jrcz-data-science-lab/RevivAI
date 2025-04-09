import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

interface AnimatedTextProps extends Omit<React.ComponentProps<'h1'>, 'as'> {
	as?: ElementType;
	speed?: number;
	split?: 'chars' | 'words';
	delay?: number;
}

export function AnimatedText({ as: Element = 'p', split = 'words', delay = 0, speed = 0.6, className, children, ...props }: AnimatedTextProps) {
	if (typeof children !== 'string') return <></>;
	const parts = split === 'words' ? children.split(' ') : children.split('');

	return (
		<Element className={cn('flex gap-0.5 w-full flex-wrap', split === 'words' && 'gap-1', className)} {...props}>
			{parts.map((part, i) => (
				<span className="overflow-hidden" key={i}>
					<motion.span
						className="inline-block min-w-fit"
						initial={{ translateY: 64 }}
						animate={{ translateY: 0 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: speed,
							type: 'spring',
							delay: delay + i * 0.02,
						}}
					>
						{part}
					</motion.span>
				</span>
			))}
		</Element>
	);
}
