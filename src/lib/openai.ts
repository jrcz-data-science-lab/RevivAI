import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { z } from 'zod';

/**
 * Create an OpenAI client
 * @param baseUrl The base URL of the OpenAI API
 * @param apiKey The API key for OpenAI
 * @return The OpenAI client
 */
export function createOpenAIClient(baseUrl: string, apiKey: string) {
	const openai = new OpenAI({
		baseURL: baseUrl,
		apiKey: apiKey,
		dangerouslyAllowBrowser: true,
		defaultHeaders: {
			Origin: import.meta.env.DEV ? window.location.origin : import.meta.env.PUBLIC_WEBSITE_URL,
		},
	});

	return openai;
}

const testSchema = z.object({ test: z.boolean() });

/**
 * Test the OpenAI client
 * @param client The OpenAI client
 * @param model The model to test
 * @return The result of the test
 */
export async function testOpenAIClient(client: OpenAI, model: string) {
	try {
		const completion = await client.beta.chat.completions.parse({
			model: model,
			messages: [{ role: 'user', content: 'Respond with true in a test field. Use structured output. ' }],
			response_format: zodResponseFormat(testSchema, 'testSchema'),
		});

		const response = completion.choices[0]?.message?.parsed;
		if (!response?.test) return { success: false, error: 'Structured output is not supported by the models' };

		return { success: true, error: null };
	} catch (error) {
		return { success: false, error: error };
	}
}
