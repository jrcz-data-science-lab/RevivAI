import type { z } from 'zod';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { createOpenAIClient } from '@/lib/openai';
import { useMemo } from 'react';
import { useAtom } from 'jotai';
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

// Current LLM providers
const apiCredentialsAtom = atomWithStorage<LLMCredentials | null>('llm-api-credentials', null);

/**
 * LLM provider hook for interacting with the LLM providers
 * @param baseUrl The base URL of the LLM provider
 * @param apiKey The API key for the LLM provider
 * @param model The model to use
 * @return The LLM provider data
 */
export function useSetup() {
    const [apiCredentials, setApiCredentials] = useAtom(apiCredentialsAtom);

    return { apiCredentials };
}
