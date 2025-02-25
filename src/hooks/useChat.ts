import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { produce } from 'immer';
import { atomWithStorage } from 'jotai/utils';
import { streamText, type CoreMessage } from 'ai';
import { languageModels, type LanguageModelKey } from '@/lib/models';

import mermaidTutorial from '@/lib/prompts/mermaid.md?raw'
import { enc } from './useTokensCount';

export interface ChatMessage {
	id: string;
	prompt: string;
	think: string;
	answer: string;
}

export interface ChatState {
	messages: ChatMessage[];
	isStreaming: boolean;
	error: string | null;
	currentMessage: ChatMessage | null;
}

export const selectedChatModelAtom = atomWithStorage<LanguageModelKey>('selectedChatModel', 'default');

export const contextSizeAtom = atom(0);

/**
 * Chat hook for interacting with the AI models
 */
export function useChat() {
	const selectedModel = useAtomValue(selectedChatModelAtom);
	const [contextSize, setContextSize] = useAtom(contextSizeAtom);

	const abortControllerRef = useRef<AbortController | null>(null);

	const [state, setState] = useState<ChatState>({
		messages: [],
		isStreaming: false,
		error: null,
		currentMessage: null,
	});

	// Chat history for LLM prompt
	const chatHistory = useMemo(() => {
		return state.messages.flatMap((msg) => [
			{ role: 'user', content: msg.prompt },
			{ role: 'assistant', content: msg.answer },
		]) satisfies CoreMessage[];
	}, [state.messages]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	const abort = useCallback(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
		setState((prev) => ({ ...prev, isStreaming: false }));
	}, []);

	const addMessage = useCallback((message: ChatMessage) => {
		setState((prev) => ({
			...prev,
			messages: [...prev.messages, message],
			currentMessage: null,
		}));
	}, []);

	const prompt = useCallback(
		async (text: string) => {
			// Cleanup previous state
			abort();
			if (state.currentMessage) addMessage(state.currentMessage); // TODO: Fix this, its not adding current message to the prompt

			// Create new message
			const newMessage: ChatMessage = {
				id: crypto.randomUUID(),
				prompt: text,
				think: '',
				answer: '',
			};

			setState((prev) => ({
				...prev,
				error: null,
				isStreaming: true,
				currentMessage: newMessage,
			}));

			// Prepare message history
			const messages: CoreMessage[] = [
				{ role: 'system', content: mermaidTutorial },
				{ role: 'system', content: 'When responding with the code - specify programming language in markdown after quotes.' },
				...chatHistory,
				{ role: 'user', content: text },
			];

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
				});

				for await (let chunk of fullStream) {
					if (abortController.signal.aborted) break;

					setState(
						produce((draft) => {
							if (!draft.currentMessage) return;
							draft.isStreaming = true;
							
							if (chunk.type === 'reasoning') {
								draft.currentMessage.think += chunk.textDelta;
							}

							if (chunk.type === 'text-delta') {
								draft.currentMessage.answer += chunk.textDelta;
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

			} catch (error: any) {
				if (error?.name === 'AbortError') return;

				setState(
					produce((draft) => {
						draft.isStreaming = false;
						draft.error = error?.message ?? 'An error occured';
					}),
				);
			}
		},
		[state.messages, state.currentMessage, abort, addMessage, selectedModel, chatHistory],
	);

	// Collect all messages
	const messages = [...state.messages, state.currentMessage].filter(Boolean) as ChatMessage[];

	return {
		messages: messages,
		currentMessage: state.currentMessage,
		isStreaming: state.isStreaming,
		error: state.error,
		prompt,
		abort,
	} as const;
};
