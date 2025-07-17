import { motion } from 'motion/react';
import { AnimatedText } from '../ui/animated-text';
import type { Codebase } from '@/hooks/useCodebase';

interface ChatWelcomeProps {
	codebase: Codebase;
}

function ChatWelcome({ codebase }: ChatWelcomeProps) {
	const repositoryUrl = codebase.repositoryUrl;
	const projectName = repositoryUrl?.split('/').pop();

	return (
		<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', duration: 0.8 }}>
			{typeof projectName === 'string' ? (
				<h1 className="text-xl mb-4 font-black font-serif">
					Project <span className='text-muted-foreground'>«</span>{projectName}<span className='text-muted-foreground'>»</span> is ready to chat!
				</h1>
			) : (
				<h1 className="text-xl mb-4 font-black font-serif">Curious how your code works? Ask about it!</h1>
			)}

			<p className="text-muted-foreground">
				You can ask something like "What does this code do?" or ask to visualize your code with diagrams, flowcharts,
				and more!
			</p>
		</motion.div>
	);
}

export default ChatWelcome;
