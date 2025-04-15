import type { z } from 'zod';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { createOpenAIClient } from '@/lib/openai';
import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';

export type LLMProvider = 'revivai' | 'openrouter' | 'openai' | 'google' | 'custom';

export interface LLMProviderData {
	name: LLMProvider;
	baseUrl: string;
	apiKey: string;
	model: string;
}

export interface ApiCredentials {
	baseUrl: string;
	apiKey: string;
	model: string;
}

// True if the LLM provider was successfully tested
const llmProviderValidAtom = atomWithStorage<boolean>('llm-provider-valid', false);

// Current LLM providers
const apiCredentialsAtom = atomWithStorage<LLMProviderData | null>('llm-credentials', null);

/**
 * LLM provider hook for interacting with the LLM providers
 * @param baseUrl The base URL of the LLM provider
 * @param apiKey The API key for the LLM provider
 * @param model The model to use
 * @return The LLM provider data
 */
export function useLLM({ baseUrl, apiKey, model }: ApiCredentials) {

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
