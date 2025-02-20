import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { LoaderPinwheel } from 'lucide-react';
import { Separator } from '../ui/separator';
import { MarkdownRenderer } from '../ui/markdown-renderer';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/useChat';

interface ChatMessageProps {
	message: Message;
	isWriting: boolean;
}

export const ChatMessage = memo(function ChatMessage({ message, isWriting }: ChatMessageProps) {
	// Check if the message has a thinking section
	const hasThinking = message.think.replace(/<\/?think>/g, '').trim() !== '';

	return (
		<div className="flex flex-col gap-2 relative p-6">
			<h3 className={cn('break-words text-2xl font-black font-serif')}>{message.prompt}</h3>

			<Separator className="mb-4" />

			<motion.div
				className="absolute -left-4 top-7 opacity-60"
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
				<div className="pb-4 -mx-6">
					<span className="text-xs inline-block pb-4 pl-4 opacity-50">Reasoning</span>
					<div className="text-sm p-6 rounded-xl bg-muted">
						<MarkdownRenderer>{message.think}</MarkdownRenderer>
					</div>
				</div>
			)}

			<div>
				<MarkdownRenderer>{message.answer}</MarkdownRenderer>
			</div>
		</div>
	);
});
