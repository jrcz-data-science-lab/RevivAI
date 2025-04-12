import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { produce } from 'immer';
import { atomWithStorage } from 'jotai/utils';
import { type CoreMessage, streamText } from 'ai';
import { type LanguageModelKey, languageModels } from '../lib/models';
import { countTokens } from '../lib/countTokens';

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

// Selected chat model
export const selectedChatModelAtom = atomWithStorage<LanguageModelKey>('selected-chat-model', 'default');

// Context size
export const contextSizeAtom = atom(0);

// Chat state
export const chatStateAtom = atom<ChatState>({
	messages: [],
	isStreaming: false,
	errorMessage: null,
	currentMessage: null,
});

/**
 * Chat hook for interacting with the AI models
 */
export function useChat() {
	const abortControllerRef = useRef<AbortController | null>(null);

	const selectedModel = useAtomValue(selectedChatModelAtom);
	const [_, setContextSize] = useAtom(contextSizeAtom);
	const [state, setState] = useAtom<ChatState>(chatStateAtom);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			setState((prev) => ({ ...prev, isStreaming: false }));
			abortControllerRef.current?.abort();
		};
	}, []);

	// Recalculate context size when messages change
	useEffect(() => {
		const newContextSize = state.messages.reduce((acc, msg) => acc + countTokens(msg.prompt + msg.answer), 0);
		setContextSize(newContextSize);
	}, [state.messages.length]);

	/**
	 * Abort the current streaming request
	 */
	const abort = useCallback(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
		setState((prev) => ({ ...prev, isStreaming: false }));
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

			setState(
				produce((draft) => {
					draft.currentMessage = newMessage;
					draft.messages = currentMessages;
					draft.errorMessage = null;
					draft.isStreaming = true;
				}),
			);

			// Convert chat history to CoreMessage using properly captured messages
			const chatHistory: CoreMessage[] = currentMessages.flatMap((msg) => [
				{ role: 'user', content: msg.prompt },
				{ role: 'assistant', content: msg.answer },
			]);

			// Prepare message history
			const messages: CoreMessage[] = [
				// { role: 'system', content: mermaidTutorial },
				{
					role: 'system',
					content: 'When responding with the code - specify programming language in markdown after quotes.',
				},
				...chatHistory,
				{ role: 'user', content: text },
			];

			// Calculate new context size
			setContextSize((prev) => prev + countTokens(text));

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
					onError: ({ error }) => handleError(error),
				});

				for await (const chunk of fullStream) {
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
						if (draft.currentMessage) draft.messages.push(draft.currentMessage);
						draft.currentMessage = null;
						draft.isStreaming = false;
					}),
				);
			} catch (error) {
				handleError(error);
			}
		},
		[abort, setContextSize, state.messages, state.currentMessage, selectedModel], // Added state dependencies to avoid stale closures
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

	/**
	 * Delete a message from the chat
	 */
	const deleteMessage = useCallback((id: string) => {
		setState(
			produce((draft) => {
				draft.messages = draft.messages.filter((msg) => msg.id !== id);
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
		deleteMessage,
		prompt,
		abort,
	} as const;
}
