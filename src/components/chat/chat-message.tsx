import type { ChatMessage } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { memo, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Copy, LoaderPinwheel, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import ChatReasoning from './chat-reasoning';
import { Button } from '../ui/button';
const ChatMarkdown = lazy(() => import('./chat-markdown'));

interface ChatMessageProps {
	onDelete?: (id: string) => void;
	message: ChatMessage;
	isActive: boolean;
	isWriting: boolean;
}

function ChatMessage({ message, isActive, isWriting, onDelete }: ChatMessageProps) {
	const hasReasoning = message.reasoning.trim() !== '';
	const hasAnswer = message.answer.trim() !== '';

	return (
		<motion.div
			initial={{ opacity: 0, translateY: 16 }}
			animate={{ opacity: isActive ? 1 : 0.7, scale: isActive ? 1 : 0.95, translateY: 0 }}
			transition={{ duration: 0.3, type: isActive ? 'spring' : 'tween' }}
			className={cn('message w-full flex flex-col gap-6 origin-center group relative')}
		>
			<div className="relative flex flex-col gap-2">
				<h3 className="relative text-2xl font-black font-serif break-words whitespace-pre-wrap">
					{message.prompt}
					<motion.div
						className="absolute -left-10 bottom-0.5 opacity-60"
						initial={{ opacity: 0 }}
						animate={{
							scale: isWriting ? 0.8 : 1.1,
							opacity: isWriting ? 1 : 0,
						}}
						transition={{ duration: isWriting ? 0.3 : 0.6, type: 'spring' }}
					>
						<LoaderPinwheel className="animate-spin" />
					</motion.div>
				</h3>

				<Separator className="mt-2 mb-4" />

				{hasReasoning && <ChatReasoning open={hasReasoning && !hasAnswer} content={message.reasoning} />}

				<Suspense fallback={<p className="prose dark:prose-invert">{message.answer}</p>}>
					<ChatMarkdown>{message.answer.trim()}</ChatMarkdown>
				</Suspense>
			</div>

			<div className="flex justify-start items-center -mx-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0">
				<Button size="icon" variant="ghost" className="w-8 h-8">
					<Copy />
				</Button>

				<Button size="icon" variant="ghost" onClick={() => onDelete && onDelete(message.id)} className="w-8 h-8">
					<Trash2 className="text-destructive" />
				</Button>
			</div>
		</motion.div>
	);
}

export default memo(ChatMessage);
