import { motion } from 'motion/react';
import { memo } from 'react';

function Title() {
	return (
		<h1 className="flex flex-col items-center gap-2 text-4xl font-serif max-md:text-2xl max-md:gap-1">
			{/* Automatically generate */}
			<div className="flex gap-3 overflow-hidden py-1 px-2">
				<div className="flex justify-center">
					{'Automatically'.split('').map((letter, index) => (
						<motion.span
							key={index}
							initial={{ opacity: 0, filter: 'blur(8px)' }}
							animate={{ opacity: 1, filter: 'blur(0px)' }}
							transition={{ duration: 0.4, delay: index * 0.025 }}
						>
							{letter}
						</motion.span>
					))}
				</div>

				<div className="flex justify-center">
					{'generate'.split('').map((letter, index) => (
						<motion.span
							key={index}
							initial={{ opacity: 0, filter: 'blur(8px)' }}
							animate={{ opacity: 1, filter: 'blur(0px)' }}
							transition={{ duration: 0.6, delay: 0.3 + index * 0.03 }}
						>
							{letter}
						</motion.span>
					))}
				</div>
			</div>

			{/* Documentation from Code */}
			<div className="flex gap-3 overflow-hidden pt-8 -mt-8 pb-2">
				<div className="flex justify-center font-bold pt-8 -mt-8">
					{'Documentation'.split('').map((letter, index) => (
						<motion.span
							key={index}
							initial={{ translateY: 80, rotate: 60 }}
							animate={{ translateY: 0, rotate: 0 }}
							transition={{
								duration: 0.4,
								delay: 0.8 + index * 0.02,
								type: 'spring',
								bounce: 0.5,
							}}
						>
							{letter}
						</motion.span>
					))}
				</div>

				<div className="flex justify-center italic">
					{'from'.split('').map((letter, index) => (
						<motion.span
							key={index}
							initial={{ translateY: 80, rotate: 60 }}
							animate={{ translateY: 0, rotate: 0 }}
							transition={{
								duration: 0.5,
								delay: 1 + index * 0.04,
								type: 'spring',
								bounce: 0.55,
							}}
						>
							{letter}
						</motion.span>
					))}
				</div>
				<div className="flex justify-center font-bold">
					{'Code.'.split('').map((letter, index) => (
						<motion.span
							key={index}
							initial={{ translateY: 80, rotate: 90 }}
							animate={{ translateY: 0, rotate: 0 }}
							transition={{
								duration: 0.6,
								delay: 1.2 + index * 0.06,
								type: 'spring',
								bounce: 0.6,
							}}
						>
							{letter}
						</motion.span>
					))}
				</div>
			</div>
		</h1>
	);
}

export default memo(Title);
