import { useCallback, useEffect, useRef, useState } from 'react';
import { streamText, type CoreMessage } from 'ai';
import { chatModel } from '@/lib/ollama';

interface ChatMessage {
    id: string;
    prompt: string;
    think: string;
    answer: string;
}

interface ChatError {
    message: string;
    code?: string;
}

interface ChatState {
    messages: ChatMessage[];
    isStreaming: boolean;
    error: ChatError | null;
    currentMessage: ChatMessage | null;
}

export function useChat() {
    const abortControllerRef = useRef<AbortController | null>(null);
    
    const [state, setState] = useState<ChatState>({
        messages: [],
        isStreaming: false,
        error: null,
        currentMessage: null,
    });

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);

    const abort = useCallback(() => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = null;
        setState(prev => ({ ...prev, isStreaming: false }));
    }, []);

    const addMessage = useCallback((message: ChatMessage) => {
        setState(prev => ({
            ...prev,
            messages: [...prev.messages, message],
            currentMessage: null,
        }));
    }, []);

    const prompt = useCallback(async (text: string) => {
        // Cleanup previous state
        abort();
        if (state.currentMessage) {
            addMessage(state.currentMessage);
        }

        // Create new message
        const newMessage: ChatMessage = {
            id: crypto.randomUUID(),
            prompt: text,
            think: '',
            answer: '',
        };

        setState(prev => ({
            ...prev,
            isStreaming: true,
            error: null,
            currentMessage: newMessage,
        }));

        // Setup abort controller
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        // Prepare message history
        const messageHistory: CoreMessage[] = state.messages.flatMap(msg => ([
            { role: 'user', content: msg.prompt },
            { role: 'assistant', content: msg.answer }
        ]));

		messageHistory.unshift({ role: 'system', content: 'Act as an idiot' });
        messageHistory.push({ role: 'user', content: text });

        try {
            const { textStream } = streamText({
                model: chatModel,
                messages: messageHistory,
                abortSignal: abortController.signal,
                maxTokens: 60_000,
                temperature: 0.3,
            });

            let isThinking = false;
            for await (let chunk of textStream) {
                if (abortController.signal.aborted) break;

                // Handle thinking state
                if (chunk.includes('<think>')) isThinking = true;
                if (chunk.includes('</think>')) isThinking = false;
                chunk = chunk.replace(/<\/?think>/g, '');

                // Update message content
                setState(prev => {
                    if (!prev.currentMessage) return prev;
                    
                    const field = isThinking ? 'think' : 'answer';
                    return {
                        ...prev,
                        currentMessage: {
                            ...prev.currentMessage,
                            [field]: prev.currentMessage[field] + chunk,
                        }
                    };
                });
            }

            // Finalize message
            setState(prev => {
                if (!prev.currentMessage) return prev;
                return {
                    ...prev,
                    messages: [...prev.messages, prev.currentMessage],
                    currentMessage: null,
                    isStreaming: false,
                };
            });

        } catch (error) {
            if ((error as Error)?.name === 'AbortError') return;

			console.error(error);
			
            setState(prev => ({
                ...prev,
                error: {
                    message: (error as Error)?.message || 'An error occurred',
                    code: 'STREAM_ERROR'
                },
                isStreaming: false,
            }));
        }
    }, [state.messages, state.currentMessage, abort, addMessage]);

    return {
		messages: [...state.messages, state.currentMessage].filter(Boolean) as ChatMessage[],
		currentMessage: state.currentMessage,
		isStreaming: state.isStreaming,
		error: state.error,
		prompt,
		abort,
	} as const;
}

export type { ChatMessage, ChatError };
