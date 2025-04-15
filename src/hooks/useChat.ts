import type { ChatCompletionMessageParam } from 'openai/resources';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { produce } from 'immer';
import { atomWithStorage } from 'jotai/utils';
import { countTokens } from '../lib/countTokens';
import { useLLM } from './useLLM';

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
	const llm = useLLM({ baseUrl: import.meta.env.PUBLIC_OLLAMA_API_URL, apiKey: 'ollama', model: 'llama3.2' });
	const abortControllerRef = useRef<AbortController | null>(null);

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
	const abort = async () => {
		const stopStreaming = () => {
			abortControllerRef.current?.abort();
			abortControllerRef.current = null;
			setState((prev) => ({ ...prev, isStreaming: false }));
		}

		// Sleep for a bit to allow the abort to take effect
		if (abortControllerRef.current) {
			stopStreaming();
			await new Promise((resolve) => setTimeout(resolve, 100));
		} else {
			stopStreaming();
		}
	}

	/**
	 * Prompt the AI with a message
	 */
	const prompt = useCallback(
		async (text: string) => {
			// Cleanup previous streams
			await abort();

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
			const chatHistory: ChatCompletionMessageParam[] = currentMessages.flatMap((msg) => [
				{ role: 'user', content: msg.prompt },
				{ role: 'assistant', content: msg.answer },
			]);

			// Prepare message history
			const messages: ChatCompletionMessageParam[] = [
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
				const stream = await llm.stream(messages);
				abortControllerRef.current = stream.controller;

				for await (const chunk of stream) {
					if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) break;

					const content = chunk.choices[0].delta.content;
					if (!content) continue;

					setState(
						produce((draft) => {
							if (!draft.currentMessage) return;
							draft.isStreaming = true;
							draft.currentMessage.answer += content;
						}),
					);
				}

				// Finalize message
				setState(
					produce((draft) => {
						if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) return;
						if (draft.currentMessage) draft.messages.push(draft.currentMessage);
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

	/**
	 * Clear chat
	 */
	const deleteAllMessages = useCallback(() => {
		abort();
		setState((prev) => ({ ...prev, messages: [], currentMessage: null, isStreaming: false }));
	}, []);

	// Collect all messages
	const messages = [...state.messages, state.currentMessage].filter(Boolean) as ChatMessage[];

	return {
		messages: messages,
		currentMessage: state.currentMessage,
		isStreaming: state.isStreaming,
		errorMessage: state.errorMessage,
		deleteAllMessages,
		deleteMessage,
		prompt,
		abort,
	} as const;
}
