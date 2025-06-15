import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { produce } from 'immer';
import { countTokens } from '../lib/countTokens';
import { streamText, type CoreMessage, type LanguageModelV1 } from 'ai';
import type { Codebase, Database } from './useDb';
import { useLiveQuery } from 'dexie-react-hooks';
import chatSystemPrompt from '@/lib/prompts/chat.md?raw';
import { useSettings } from './useSettings';
import { getLanguagePrompt } from '@/lib/languages';

interface UseChatProps {
	db: Database;
	model: LanguageModelV1;
}

export interface ChatMessage {
	id: string;
	prompt: string;
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
export function useChat({ db, model }: UseChatProps) {
	const abortControllerRef = useRef<AbortController | null>(null);

	const { settings } = useSettings();

	const setContextSize = useSetAtom(contextSizeAtom);
	const [state, setState] = useAtom<ChatState>(chatStateAtom);

	// Codebase prompt
	const codebase = useLiveQuery(() => db.codebases.orderBy('createdAt').last(), [db]);
	const codebasePrompt = useMemo(() => codebase?.prompt ?? '', [codebase]);

	// Tokens count for the codebase
	const codebaseTokens = useMemo(() => {
		if (!codebase) return 0;
		return codebase.metadata.totalTokens ?? countTokens(codebase.prompt);
	}, [codebase?.id]);

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
		setContextSize(newContextSize + codebaseTokens);
	}, [state.messages.length, codebaseTokens, setContextSize]);

	/**
	 * Abort the current streaming request
	 */
	const abort = async () => {
		const stopStreaming = () => {
			abortControllerRef.current?.abort();
			abortControllerRef.current = null;
			setState((prev) => ({ ...prev, isStreaming: false }));
		};

		// Sleep for a bit to allow the abort to take effect
		if (abortControllerRef.current) {
			stopStreaming();
			await new Promise((resolve) => setTimeout(resolve, 100));
		} else {
			stopStreaming();
		}
	};

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
				{ role: 'system', content: chatSystemPrompt },
				{ role: 'user', content: codebasePrompt },
				...chatHistory,
				{ role: 'user', content: getLanguagePrompt(settings.language) },
				{ role: 'user', content: text },
			];

			// Calculate new context size
			setContextSize((prev) => prev + countTokens(text));

			try {
				const controller = new AbortController();
				abortControllerRef.current = controller;

				const { textStream } = streamText({
					model: model,
					messages: messages,
					temperature: settings.temperature,
					abortSignal: controller.signal,
					onError: ({ error }) => handleError(error),
				});

				for await (const textPart of textStream) {
					setState(
						produce((draft) => {
							if (!draft.currentMessage) return;
							draft.isStreaming = true;
							draft.currentMessage.answer += textPart;
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
		[abort, setContextSize, state.messages, state.currentMessage, codebasePrompt], // Added state dependencies to avoid stale closures
	);

	/**
	 * Handle streaming errors
	 */
	const handleError = useCallback((error: unknown) => {
		if ((error as Error)?.name === 'AbortError') return; // Ignore controller aborts

		setState(
			produce((draft) => {
				let errorMessage = 'An unknown error occurred';
				if (error instanceof Error) errorMessage = error.message;
				if (typeof error === 'string') errorMessage = error;

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
		setState({
			messages: [],
			currentMessage: null,
			isStreaming: false,
			errorMessage: null,
		});
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
