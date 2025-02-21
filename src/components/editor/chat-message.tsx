import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { LoaderPinwheel } from 'lucide-react';
import { Separator } from '../ui/separator';
import ChatMarkdown from './chat-markdown';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';
import { Chat } from './chat';

interface ChatMessageProps {
	message: Message;
    isActive: boolean
	isWriting: boolean;
}

function ChatMessage({ message, isActive, isWriting }: ChatMessageProps) {
	// Check if the message has a thinking section
	const hasThinking = message.think.replace(/<\/?think>/g, '').trim() !== '';

	return (
		<motion.div
			key={message.id}
			initial={{ opacity: 0, translateY: 16 }}
			animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95, translateY: 0 }}
			transition={{ duration: 0.3, type: isActive ? 'spring' : 'tween' }}
			className={cn('message w-full flex flex-col gap-6 origin-center p-6', isActive && 'pb-32')}
		>
			<div className="relative flex flex-col gap-2">
				<h3 className={cn('break-words text-2xl font-black font-serif')}>{message.prompt}</h3>

				<Separator className="mb-4" />

				<motion.div
					className="absolute -left-10 top-1.5 opacity-60"
					initial={{ opacity: 0 }}
					animate={{
						scale: isWriting ? 1 : 1.1,
						opacity: isWriting ? 1 : 0,
					}}
					transition={{ duration: isWriting ? 0.3 : 0.6, type: 'spring' }}
				>
					<LoaderPinwheel className="animate-spin" />
				</motion.div>

				{hasThinking && (
                    <div className="text-sm p-6 pt-4 mb-8 rounded-xl bg-muted">
                        <span className="text-xs inline-block mb-4 opacity-30">Reasoning</span>
                        <ChatMarkdown>{message.think}</ChatMarkdown>
                    </div>
				)}

				<div>
					<ChatMarkdown>{message.answer}</ChatMarkdown>
				</div>
			</div>
		</motion.div>
	);
};

export default memo(ChatMessage);
