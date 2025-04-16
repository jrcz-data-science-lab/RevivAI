import { motion } from 'motion/react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CircleX } from 'lucide-react';

interface ChatErrorProps {
	errorMessage: string | null;
}

export function ChatError({ errorMessage }: ChatErrorProps) {
	if (!errorMessage) return null;

	return (
		<motion.div
			initial={{ opacity: 0, translateY: 16 }}
			animate={{ opacity: 1, translateY: 0 }}
			exit={{ opacity: 0, translateY: -16 }}
			transition={{ duration: 0.6, type: 'spring' }}
			className="mb-4"
		>
			<Alert variant="destructive" className='max-h-[50vh] overflow-y-auto'>
				<CircleX className="h-4 w-4" />
				<AlertTitle>Error sending request to LLM!</AlertTitle>
				<AlertDescription>{errorMessage}</AlertDescription>
			</Alert>
		</motion.div>
	);
}
