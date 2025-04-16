import type { z } from 'zod';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { createOpenAIClient } from '@/lib/openai';
import { useMemo } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

export type LLMProvider = 'revivai' | 'openrouter' | 'openai' | 'google' | 'custom';

export interface LLMCredentials {
	name: LLMProvider;
	baseUrl: string;
	apiKey: string;
	model: string;
	valid: boolean;
}

export interface useLLMProps {
	baseUrl: string;
	apiKey: string;
	model: string;
}

// Current LLM provider data
export const llmCredentialsAtom = atomWithStorage<LLMCredentials | null>('llm-api-credentials', null);

/**
 * LLM provider hook for interacting with the LLM providers
 * @return The LLM provider data
 */
export function useLLM() {
		const credentials = useAtomValue(llmCredentialsAtom);

		const { baseUrl, apiKey, model } = credentials || {
			baseUrl: import.meta.env.PUBLIC_LLM_API_URL,
			apiKey: import.meta.env.PUBLIC_LLM_API_KEY,
			model: import.meta.env.PUBLIC_LLM_API_MODEL,
		};

		// Create a new LLM client
		const ai = useMemo(() => createOpenAIClient(baseUrl, apiKey), [baseUrl, apiKey]);

		/**
		 * Get completion from LLM
		 * @param messages The messages to send to the model
		 * @return The completion response
		 */
		const prompt = async (messages: ChatCompletionMessageParam[]) => {
			const response = await ai.chat.completions.create({
				model: model,
				messages: messages,
			});

			return response.choices[0]?.message?.content;
		};

		/**
		 * Stream completion from LLM
		 * @param messages The messages to send to the model
		 * @return The stream of messages
		 */
		const stream = async (messages: ChatCompletionMessageParam[]) => {
			const response = await ai.chat.completions.create({
				model: model,
				messages: messages,
				stream: true,
			});

			return response;
		};

		/**
		 * Get structured completion from LLM
		 * @param messages The messages to send to the model
		 * @param schema The Zod schema to validate the response
		 * @param schemaName The name of the schema
		 * @return The structured response
		 */
		const structuredPrompt = async <T extends z.ZodTypeAny>(messages: ChatCompletionMessageParam[], schema: T, schemaName: string): Promise<z.TypeOf<T>> => {
			const completion = await ai.beta.chat.completions.parse({
				model: model,
				messages: messages,
				response_format: zodResponseFormat(schema, schemaName),
			});

			return completion.choices[0]?.message?.parsed;
		};

		return { stream, prompt, structuredPrompt };
	}
