import { motion } from 'motion/react';

export function PageContainer({ children }: { children?: React.ReactNode }) {
	return (
		<div className="relative w-full min-h-full max-w-prose overflow-x-hidden px-6 pt-8 mb-16 mx-auto">
			<motion.div
				initial={{ opacity: 0, translateY: 8 }}
				animate={{ opacity: 1, translateY: 0, transition: { delay: 0.3 } }}
                exit={{ opacity: 0, translateY: 8 }}
				transition={{ duration: 0.6, type: 'spring' }}
				className="flex flex-col p-4 gap-4"
			>
				{children}
			</motion.div>
		</div>
	);
}
