import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { produce } from 'immer';
import { atomWithStorage } from 'jotai/utils';
import { streamText, type CoreMessage } from 'ai';
import { languageModels, type LanguageModelKey } from '@/lib/models';
import { enc } from './useTokensCount';

export interface ChatMessage {
	id: string;
	prompt: string;
	reasoning: string;
	answer: string;
}

export interface ChatState {
	messages: ChatMessage[];
	isStreaming: boolean;
	errorMessage: string | null;
	currentMessage: ChatMessage | null;
}

export const selectedChatModelAtom = atomWithStorage<LanguageModelKey>('selectedChatModel', 'default');

export const contextSizeAtom = atom(0);

/**
 * Chat hook for interacting with the AI models
 */
export function useChat() {
	const abortControllerRef = useRef<AbortController | null>(null);

	const selectedModel = useAtomValue(selectedChatModelAtom);
	const [contextSize, setContextSize] = useAtom(contextSizeAtom);

	const [state, setState] = useState<ChatState>({
		messages: [],
		isStreaming: false,
		errorMessage: null,
		currentMessage: null,
	});

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	/**
	 * Abort the current streaming request
	 */
	const abort = useCallback(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
		setState((prev) => ({ ...prev, isStreaming: false }));
	}, []);

	/**
	 * Add a message to the chat history
	 */
	const addMessage = useCallback((message: ChatMessage) => {
		setState((prev) => ({
			...prev,
			messages: [...prev.messages, message],
			currentMessage: null,
		}));
	}, []);

	/**
	 * Prompt the AI with a message
	 */
	const prompt = useCallback(
		async (text: string) => {
			// Cleanup previous streams
			abort();
		
			const newMessage: ChatMessage = {
				id: crypto.randomUUID(),
				prompt: text,
				reasoning: '',
				answer: '',
			};

			// Get current messages before state update
			const currentMessages = [...state.messages];
			if (state.currentMessage) currentMessages.push(state.currentMessage);
			
			setState(produce((draft) => {
				draft.currentMessage = newMessage;
				draft.messages = currentMessages;
				draft.errorMessage = null;
				draft.isStreaming = true;
			}));

			// Convert chat history to CoreMessage using properly captured messages
			const chatHistory: CoreMessage[] = currentMessages.flatMap((msg) => [
				{ role: 'user', content: msg.prompt },
				{ role: 'assistant', content: msg.answer },
			]);

			// Prepare message history
			const messages: CoreMessage[] = [
				// { role: 'system', content: mermaidTutorial },
				{ role: 'system', content: 'When responding with the code - specify programming language in markdown after quotes.' },
				...chatHistory,
				{ role: 'user', content: text },
			];

			// Calculate new context size
			const newContextSize = messages.reduce((acc, msg) => acc + enc.encode(msg.content as string).length, 0);
			setContextSize(newContextSize);

			try {
				// Setup abort controller
				const abortController = new AbortController();
				abortControllerRef.current = abortController;

				const { fullStream } = streamText({
					model: languageModels[selectedModel].model,
					abortSignal: abortController.signal,
					messages,
					maxTokens: 60_000,
					temperature: 0.3,
					onError: ({ error }) => handleError(error as Error),
				});

				for await (let chunk of fullStream) {
					if (abortController.signal.aborted) break;

					setState(
						produce((draft) => {
							if (!draft.currentMessage) return;
							draft.isStreaming = true;

							switch (chunk.type) {
								case 'reasoning':
									draft.currentMessage.reasoning += chunk.textDelta;
									break;
								case 'text-delta':
									draft.currentMessage.answer += chunk.textDelta;
									break;
								case 'error':
									handleError(chunk.error as Error);
									break;
							}
						}),
					);
				}

				// Finalize message
				setState(
					produce((draft) => {
						if (!draft.currentMessage) return;
						draft.messages.push(draft.currentMessage);
						draft.currentMessage = null;
						draft.isStreaming = false;
					}),
				);
			} catch (error) {
				handleError(error);
			}
		},
		[abort, setContextSize, state.messages, state.currentMessage], // Added state dependencies to avoid stale closures
	);

	/**
	 * Handle streaming errors
	 */
	const handleError = useCallback((error: unknown) => {
		if ((error as Error)?.name === 'AbortError') return; // Ignore controller aborts

		console.error(error);

		let errorMessage = 'An error occured.';
		if (error instanceof Error) errorMessage = error.message;
		if (typeof error === 'string') errorMessage = error;

		setState(
			produce((draft) => {
				draft.isStreaming = false;
				draft.errorMessage = errorMessage;
			}),
		);
	}, []);

	// Collect all messages
	const messages = [...state.messages, state.currentMessage].filter(Boolean) as ChatMessage[];

	return {
		messages: messages,
		currentMessage: state.currentMessage,
		isStreaming: state.isStreaming,
		errorMessage: state.errorMessage,
		prompt,
		abort,
	} as const;
};
