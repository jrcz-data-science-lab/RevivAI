import { useEffect, useRef } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import Navbar from './navbar';
import ChatInput from './chat-input';
import ChatWelcome from './chat-welcome';
import ChatMessage from './chat-message';
import { motion } from 'motion/react';

export function Chat() {
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const chat = useChat();

	useEffect(() => {
		if (!chatContainerRef.current) return;
		if (!chat.currentMessage) return;

		// Select last message
		const messageElement = chatContainerRef.current?.querySelector('.message:last-child');
		if (!messageElement) return;

		// Scroll to last message
		const offset = 128;
		const top = messageElement.getBoundingClientRect().top + chatContainerRef.current.scrollTop - offset;
		chatContainerRef.current.scrollTo({ top, behavior: 'smooth' });
	
	}, [chatContainerRef, chat.currentMessage?.id]);

	// Check if there are any messages in chat
	const chatActive = chat.messages.length > 0;

	return (
		<div ref={chatContainerRef} className={cn('flex flex-col w-full overflow-x-hidden max-h-screen', chatActive && 'min-h-screen')}>
			<div className="z-50 fixed top-4 left-0 px-4 md:top-8 md:px-12 flex w-full justify-space-between">
				<Navbar />
			</div>

			<Toaster />

			<div className="flex justify-center items-center">
				<div className="z-0 flex flex-col w-full min-h-fit max-w-prose gap-2 px-1">
					{/* Gradient overlays */}
					<div className="z-30 fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent not-dark:hidden"></div>

					{!chatActive && (
						<div className="mb-12">
							<ChatWelcome />
						</div>
					)}

					{chatActive && (
						<div className="flex flex-col gap-12 py-32 pb-[60vh]">
							{chat.messages.map((message, index) => {
								if (!message) return null;

								const isLast = index === chat.messages.length - 1;
								const isWriting = chat.isStreaming && message === chat.currentMessage;

								return <ChatMessage key={message.id} message={message} isActive={isLast} isWriting={isWriting} />;
							})}
						</div>
					)}

					<div className={cn('w-full h-auto bg-background', chatActive && 'flex justify-center absolute bottom-0 left-0')}>
						<motion.div
							initial={{ opacity: 0, translateY: 16 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{ duration: 0.6, type: 'spring' }}
							className="max-w-prose w-full pb-8"
						>
							<ChatInput onSubmit={(text) => chat.prompt(text)} onAbort={() => chat.abort()} isStreaming={chat.isStreaming} />
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
