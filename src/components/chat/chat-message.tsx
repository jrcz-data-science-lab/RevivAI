import { cn } from '@/lib/utils';
import { Copy, LoaderPinwheel, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { Suspense, lazy, memo } from 'react';
import type { ChatMessage as ChatMessageType } from '../../hooks/useChat';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const ChatMarkdownLazy = lazy(() => import('./chat-markdown'));

interface ChatMessageProps {
	onDelete?: (id: string) => void;
	message: ChatMessageType;
	isWriting: boolean;
}

// TODO: Light mode for chat messages

/**
 * Chat message component
 */
function ChatMessage({ message, isWriting, onDelete }: ChatMessageProps) {
	const copyToClipboard = () => {
		navigator.clipboard.writeText(message.answer);
	};

	return (
		<motion.div
			initial={isWriting ? { opacity: 0, y: 16 } : {}}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, type: 'tween' }}
			className={cn('message w-full flex flex-col gap-6 origin-center group relative')}
		>
			<Suspense>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.15 }}
					className="relative flex flex-col gap-2"
				>
					<h3 className="relative text-xl font-black font-serif break-words whitespace-pre-wrap">
						<span className="max-w-10/12 block">{message.prompt}</span>
					</h3>

					<motion.div
						className={cn(
							'absolute -left-10 opacity-60 max-md:hidden',
							message.answer === '' ? 'top-0.5' : 'bottom-0.5',
						)}
						initial={{ opacity: 0 }}
						animate={isWriting ? { opacity: 1, scale: 0.8 } : { opacity: 0, scale: 1.1 }}
						transition={{ duration: isWriting ? 0.3 : 0.6, type: 'spring' }}
					>
						<LoaderPinwheel className="animate-spin" />
					</motion.div>

					<Separator className="separator mt-1 mb-3" />

					<ChatMarkdownLazy>{message.answer}</ChatMarkdownLazy>
				</motion.div>
			</Suspense>

			<div className="flex justify-start items-center -mx-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0">
				<Button size="icon" variant="ghost" className="w-8 h-8" onClick={copyToClipboard}>
					<Copy />
				</Button>

				<Button
					size="icon"
					variant="ghost"
					onClick={() => onDelete?.(message.id)}
					className="w-8 h-8 hover:text-destructive"
				>
					<Trash />
				</Button>
			</div>
		</motion.div>
	);
}

export default memo(ChatMessage);
