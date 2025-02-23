import { useEffect, useRef } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import Navbar from './navbar';
import ChatInput from './chat-input';
import ChatWelcome from './chat-welcome';
import ChatMessage from './chat-message';

export function Chat() {
	const chatContainerRef = useRef<HTMLDivElement>(null);
	const chat = useChat();

	useEffect(() => {
		if (!chatContainerRef.current) return;
		if (!chat.currentMessage) return;

		const messageElement = chatContainerRef.current?.querySelector('.message:last-child');
		if (!messageElement) return;

		const offset = 128;
		const top = messageElement.getBoundingClientRect().top + chatContainerRef.current.scrollTop - offset;
		chatContainerRef.current.scrollTo({ top, behavior: 'smooth' });

		// messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
	
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
				<div className="z-0 flex flex-col w-full min-h-fit max-w-prose mx-auto overflow-x-hidden gap-2 px-4">
					{/* Gradient overlays */}
					<div className="z-30 fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
					<div className="z-30 fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent"></div>
					<div className="z-30 fixed top-0 left-0 w-full h-16 bg-gradient-to-b from-background to-transparent"></div>

					{!chatActive && (
						<div className="px-0 prose dark:prose-invert">
							<ChatWelcome />
						</div>
					)}

					{chatActive && (
						<div className="flex flex-col gap-12 py-32 pb-[60vh]">
							{chat.messages.map((message, index) => {
								if (!message) return null;

								const isLast = index === chat.messages.length - 1;
								const isWriting = chat.isStreaming && message === chat.currentMessage;

								return <ChatMessage 
									key={message.id} 
									message={message} 
									isActive={isLast} 
									isWriting={isWriting} 
								/>;
							})}
						</div>
					)}

					<div
						className={cn(
							'flex flex-col gap-2 w-full h-auto mt-16 max-w-prose bg-background',
							chatActive && 'absolute bottom-0 pb-8 pr-8 w-full',
						)}
					>
						<ChatInput onSubmit={chat.prompt} onAbort={chat.abort} isStreaming={chat.isStreaming} />
					</div>
				</div>
			</div>
		</div>
	);
}
