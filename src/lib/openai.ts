import { z } from 'zod';

import { generateObject } from 'ai';
import { createOpenAI, type OpenAIProvider } from '@ai-sdk/openai';

/**
 * Create an OpenAI client
 * @param baseUrl The base URL of the OpenAI API
 * @param apiKey The API key for OpenAI
 * @return The OpenAI client
 */
export function createOpenAIClient(baseUrl: string, apiKey: string) {
	const openai = createOpenAI({
		baseURL: baseUrl,
		apiKey: apiKey,
		compatibility: 'compatible',
	});

	return openai;
}

/**
 * Test the OpenAI client
 * @param client The OpenAI client
 * @param model The model to test
 * @return The result of the test
 */
export async function testOpenAIClient(client: OpenAIProvider, model: string) {
	try {

		const { object } = await generateObject({
			model: client(model),
			schema: z.object({ test: z.boolean() }),
			prompt: 'Set property "test" to "true". Use structured output.',
		});

		if (!object?.test) return { success: false, error: 'Structured output is not supported by the models' };

		return { success: true, error: null };
	} catch (error) {
		console.error(error);
		return { success: false, error: new Error('API is not responding correctly') };
	}
}
