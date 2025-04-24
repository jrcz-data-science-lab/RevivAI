import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useChat } from '../../hooks/useChat';
import ChatInput from './chat-input';
import ChatWelcome from './chat-welcome';
import ChatMessage from './chat-message';
import { ChatError } from './chat-error';
import type { LanguageModelV1 } from 'ai';
import type { Database } from '@/hooks/useDb';
import { useLiveQuery } from 'dexie-react-hooks';

interface ChatProps {
	db: Database;
	model: LanguageModelV1;
}

export function Chat({ db, model }: ChatProps) {
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const chat = useChat({ db, model });

	const scrollToLastMessage = (behavior: ScrollBehavior) => {
		if (!chatContainerRef.current) return;

		// Select last message
		const messageElement = chatContainerRef.current?.querySelector('.message:last-child .separator');
		if (!messageElement) return;

		// Scroll to last message
		const offset = window.innerHeight / 4;
		const top = messageElement.getBoundingClientRect().bottom + chatContainerRef.current.scrollTop - offset;
		chatContainerRef.current.scrollTo({ top, behavior });
	};

	// Scroll to last message on mount
	useEffect(() => {
		scrollToLastMessage('smooth');
		return () => {chat.abort()};
	}, []);

	// Scroll to last message on new message
	useEffect(() => {
		if (!chatContainerRef.current) return;
		if (!chat.currentMessage) return;

		scrollToLastMessage('smooth');
	}, [chatContainerRef, chat.currentMessage?.id]);

	// Check if there are any messages in chat
	const chatActive = chat.messages.length > 0;

	return (
		<div
			ref={chatContainerRef}
			className={cn('flex flex-col w-full overflow-x-hidden max-h-screen', chatActive && 'min-h-screen')}
		>
			<div className="flex justify-center items-center">
				<div className="z-0 flex flex-col w-full min-h-fit max-w-prose gap-2 px-1">
					{!chatActive && (
						<div className="mb-12 mx-6">
							<ChatWelcome />
						</div>
					)}

					{chatActive && (
						<div className="flex flex-col gap-12 pt-48 min-h-screen pb-[80vh] px-3 max-sm:px-4">
							{chat.messages.map((message, index) => {
								if (!message) return null;
								const isWriting = chat.isStreaming && message === chat.currentMessage;

								return (
									<ChatMessage key={message.id} message={message} isWriting={isWriting} onDelete={chat.deleteMessage} />
								);
							})}
						</div>
					)}

					<div className="z-40 fixed top-0 left-0 w-full">
						<div className="absolute w-full h-16 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-24 bg-gradient-to-b from-background to-transparent" />
						<div className="absolute w-full h-32 bg-gradient-to-b from-background to-transparent" />
					</div>

					<div
						className={cn(
							'w-full h-auto bg-background px-4',
							chatActive && 'flex flex-col items-center absolute bottom-0 left-0',
						)}
					>
						<motion.div
							initial={{ opacity: 0, translateY: 16 }}
							animate={{ opacity: 1, translateY: 0 }}
							transition={{ duration: 0.6, type: 'spring' }}
							className="max-w-prose w-full pb-8"
						>
							<AnimatePresence>{chat.errorMessage && <ChatError errorMessage={chat.errorMessage} />}</AnimatePresence>

							<ChatInput
								modelName={model.modelId}
								messagesCount={chat.messages.length}
								onSubmit={(text) => chat.prompt(text)}
								onAbort={() => chat.abort()}
								onClear={() => chat.deleteAllMessages()}
								isStreaming={chat.isStreaming}
							/>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
