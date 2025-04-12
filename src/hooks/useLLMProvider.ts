import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type LLMProvider = 'revivai' | 'openrouter' | 'openai' | 'google' | 'custom';

export interface LLMProviderData {
	name: LLMProvider;
	baseUrl: string;
	apiKey: string;
	model: string;
}

// True if the LLM provider was successfully tested
const llmProviderValidAtom = atomWithStorage<boolean>('llm-provider-valid', false);

// Current LLM providers
const llmProviderDataAtom = atomWithStorage<LLMProviderData | null>('llm-provider-data', null);

/**
 * LLM provider hook for interacting with the LLM providers
 */
export function useLLMProvider() {
    const [providerValid, setProviderValid] = useAtom(llmProviderValidAtom);
	const [providerData, setProviderData] = useAtom(llmProviderDataAtom);


	return { providerData };
}
