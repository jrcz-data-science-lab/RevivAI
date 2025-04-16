import type { ChatCompletionMessageParam } from 'openai/resources';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { produce } from 'immer';
import { atomWithStorage } from 'jotai/utils';
import { countTokens } from '../lib/countTokens';
import { useLLM } from './useLLM';
import { llmCredentialsAtom, type LLMCredentials, type LLMProvider } from '@/hooks/useLLM';
import { createOpenAIClient, testOpenAIClient } from '@/lib/openai';
import { toast } from 'sonner';
import type { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';

/**
 * Chat hook for interacting with the AI models
 */
export function useSetup() {
  const [credentials, setCredentials] = useAtom(llmCredentialsAtom);

  const handleProviderChange = useCallback((provider: LLMProvider) => {
    switch (provider) {
      case 'revivai':
        setCredentials({
          name: 'revivai',
          baseUrl: import.meta.env.PUBLIC_OLLAMA_API_URL,
          apiKey: 'ollama',
          model: 'llama3.2',
          valid: false,
        });
        break;
      case 'openrouter':
        setCredentials((current) => ({
          name: 'openrouter',
          model: 'llama3.2',
          baseUrl: 'https://openrouter.ai/api/v1',
          apiKey: current?.apiKey ?? '',
          valid: false,
        }));
        break;
      case 'openai':
        setCredentials((current) => ({
          name: 'openai',
          model: 'gpt-4o',
          baseUrl: 'https://api.openai.com/v1',
          apiKey: current?.apiKey ?? '',
          valid: false,
        }));
        break;
      case 'google':
        setCredentials((current) => ({
          name: 'google',
          model: 'gemini-2.0-flash',
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
          apiKey: current?.apiKey ?? '',
          valid: false,
        }));
        break;
      case 'custom':
        setCredentials((current) => ({
          name: 'custom',
          baseUrl: '',
          model: '',
          apiKey: current?.apiKey ?? '',
          valid: false,
        }));
        break;
    }
  }, [setCredentials]);

  const setCredentialsStatus = useCallback((status: boolean) => {
    setCredentials((current) => {
      if (!current) return current;
      return {
        ...(current || {}),
        valid: status,
      };
    });
  }, [setCredentials]);

  const validate = useCallback(async (credentials: LLMCredentials) => {
    const client = createOpenAIClient(credentials.baseUrl, credentials.apiKey);
    const { success, error } = await testOpenAIClient(client, credentials.model);
    if (!success) {
      console.error(error);
      toast.error('LLM is not responding correctly.', { description: `${error}`, richColors: true });
      setCredentials({ ...credentials, valid: false });
      return false;
    }
    toast.success('Success! LLM is responding correctly.', {});
    setCredentials({ ...credentials, valid: true });
    setCredentialsStatus(true);
    return true;
  }, [setCredentials, setCredentialsStatus]);

  const submit = useCallback(async (credentials: LLMCredentials, isTesting: boolean) => {
    if (isTesting) return;
    if (!credentials.valid) {
      const accessible = await validate(credentials);
      if (!accessible) return;
    }
  }, [validate]);

  return {
    credentials,
    setCredentials,
    handleProviderChange,
    setCredentialsStatus,
    validate,
    submit,
  };
}
