import type { LLMProvider } from '@/hooks/useModel';
import type { JSX } from 'react';

// Links of messages to get API keys for each provider
const HELP_MESSAGES: Record<LLMProvider, JSX.Element | null> = {
    openai: (
        <span>
            You can get an OpenAI API key by going to the{' '}
            <a href="https://platform.openai.com/api-keys" className="underline text-foreground">
                OpenAI Developer Portal
            </a>
            {' '}and generating a new API key.
        </span>
    ),
    anthropic: (
        <span>
            You can get an Anthropic API key by going to{' '}
            <a href="https://console.anthropic.com/settings/keys" className="underline text-foreground">
                the Anthropic Console
            </a>
            {' '}and generating a new API key.
        </span>
    ),
    google: (
        <span>
            You can get a Google API key by going to{' '}
            <a href="https://aistudio.google.com/app/apikey" className="underline text-foreground">
                Google AI Studio
            </a>
            {' '}and generating a new API key.
        </span>
    ),
    openrouter: (
        <span>
            You can get an API key by going to{' '}
            <a href="https://openrouter.ai/settings/keys" className="underline text-foreground">
                OpenRouter Settings
            </a>
            . Learn how to get started in the{' '}
            <a href="https://openrouter.ai/docs/faq#how-do-i-get-started-with-openrouter" className="underline text-foreground">
                OpenRouter Docs
            </a>
            .
        </span>
    ),
    custom: (
        <span>
            You can use any LLM provider that supports the OpenAI API. Just enter the API URL and API key.
        </span>
    ),
    revivai: null,
};

/**
 * Component with the help message, with how to get the API key for each provider.
 */
export function SetupHelp({ provider }: { provider: LLMProvider }) {
    const message = HELP_MESSAGES[provider];
    if (message) return <p className="text-sm text-muted-foreground">{message}</p>;
}
