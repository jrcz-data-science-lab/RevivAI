import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createOllama } from 'ollama-ai-provider';

// LLM provider types
export type LLMProvider = 'revivai' | 'openrouter' | 'anthropic' | 'openai' | 'google' | 'custom';

// LLM provider credentials
export interface LLMCredentials {
	provider: LLMProvider;
	baseUrl: string;
	apiKey: string;
	model: string;
}

// Get initial credentials from local storage on first load
const getInitialCredentials = () => {
	if (import.meta.env.SSR) return null;
	const provider = localStorage.getItem('llm-api-credentials');
	const credentials = provider ? (JSON.parse(provider) as LLMCredentials) : null;
	return credentials;
};

// Current LLM provider data
export const apiCredentialsAtom = atomWithStorage<LLMCredentials | null>(
	'llm-api-credentials',
	getInitialCredentials(),
);

/**
 * Create an LLM Model client
 * @param credentials The LLM provider credentials
 */
export function createModel(credentials: LLMCredentials) {
	switch (credentials.provider) {
		// OpenRouter API
		case 'openrouter':
			return createOpenRouter({
				baseURL: credentials?.baseUrl,
				apiKey: credentials?.apiKey,
				compatibility: 'compatible',
			})(credentials.model);

		// Anthropic Claude
		case 'anthropic':
			return createAnthropic({
				baseURL: credentials?.baseUrl,
				apiKey: credentials?.apiKey,
			})(credentials.model);

		// Google Generative AI API
		case 'google':
			return createGoogleGenerativeAI({
				baseURL: credentials?.baseUrl,
				apiKey: credentials?.apiKey,
			})(credentials.model);

		// Ollama for RevivAI
		case 'revivai':
			return createOllama({
				baseURL: import.meta.env.PUBLIC_OLLAMA_API_URL,
			})(import.meta.env.PUBLIC_OLLAMA_API_MODEL);

		// OpenAI and Custom OpenAI Like providers
		default:
			return createOpenAI({
				baseURL: credentials?.baseUrl,
				apiKey: credentials?.apiKey,
				compatibility: 'compatible',
			})(credentials.model);
	}
}

/**
 * LLM provider hook for interacting with the LLM providers
 * @return The LLM provider data
 */
export function useModel() {
	const [credentials, setCredentials] = useAtom(apiCredentialsAtom);

	// Initiate LLM client
	const model = useMemo(() => {
		if (!credentials) return null;
		return createModel(credentials);
	}, [credentials]);

	return { model, credentials, setCredentials };
}
