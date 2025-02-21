import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atom } from 'jotai';
import { ollama } from 'ollama-ai-provider';
import { streamText } from 'ai';
import { chatModel } from '@/lib/ollama';
import { produce } from 'immer';

export interface Message {
	id: string;
	prompt: string;
	think: string;
	answer: string;
}

export function useChat() {
	const abortRef = useRef<AbortController | null>(null);

	const [isStreaming, setIsStreaming] = useState(false);
	const [messagesHistory, setMessagesHistory] = useState<Message[]>([]);
	const [currentMessage, setCurrentMessage] = useState<Message | null>(null);

    /**
     * Abort the current prompt request.
     * This will stop the current prompt request and clear the current message.
     */
	const abort = useCallback(() => {
		if (abortRef.current) abortRef.current?.abort();
		abortRef.current = null;
		setIsStreaming(false);
	}, []);

    /**
     * Flush the current message to the history.
     * This will add the current message to the history and clear the current message.
     */
	const flush = useCallback(() => {
		if (currentMessage) {
			setMessagesHistory((history) => [...history, currentMessage]);
			setCurrentMessage(null);
		}
	}, [currentMessage]);

	/**
	 * Prompt the chat model with a given prompt.
	 * @param prompt The prompt to send to the chat model.
	 */
	const prompt = useCallback(
		async (text: string) => {
			abort();
			flush();

			const abortController = new AbortController();
			abortRef.current = abortController;

			const { textStream } = streamText({
				model: chatModel,
				prompt: text,
				abortSignal: abortController.signal,
				onError: (error) => {
					setIsStreaming(false);
				},
				onFinish: () => {
					setIsStreaming(false);
				},
			});

			if (!currentMessage) {
				const newMessage: Message = {
					id: Date.now().toString(),
					prompt: text,
					think: '',
					answer: '',
				};

				setCurrentMessage(newMessage);
			}

			setIsStreaming(true);

			let isThinking = false;
			for await (const textPart of textStream) {
				if (textPart.includes('<think>')) isThinking = true;
				if (textPart.includes('</think>')) isThinking = false;

				setCurrentMessage((currentMessage) => {
					if (!currentMessage) {
						return {
							id: Date.now().toString(),
							prompt: text,
							think: '',
							answer: '',
						};
					}

					const responseType = isThinking ? 'think' : 'answer';
					return {
						...currentMessage,
						[responseType]: currentMessage[responseType] + textPart,
					};
				});
			}

			setIsStreaming(false);
		},
		[currentMessage, abort, flush],
	);

    // All messages in the chat history
	const messages = useMemo(() => {
		return currentMessage ? [...messagesHistory, currentMessage] : messagesHistory;
	}, [messagesHistory, currentMessage]);

	return { prompt, abort, messages, currentMessage, messagesHistory, isStreaming };
}
