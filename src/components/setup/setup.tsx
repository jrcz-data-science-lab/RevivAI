import { generateObject } from 'ai';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { SetupBanner } from './setup-banner';
import { Toaster } from '@/components/ui/toaster';
import { LoaderCircle } from 'lucide-react';
import { createModel, useModel, type LLMCredentials, type LLMProvider } from '@/hooks/useModel';

const PUBLIC_MODEL_PROVIDED = !!import.meta.env.PUBLIC_LLM_API_URL;

/**
 * Get the default credentials for the selected LLM provider
 * @param provider The LLM provider to get the credentials for
 */
function getDefaultCredentials(provider: LLMProvider): LLMCredentials {
	switch (provider) {
		case 'revivai':
			return {
				provider: 'revivai',
				baseUrl: import.meta.env.PUBLIC_LLM_API_URL,
				apiKey: import.meta.env.PUBLIC_LLM_API_KEY,
				model: import.meta.env.PUBLIC_LLM_API_MODEL,
			};

		case 'openrouter':
			return {
				provider: 'openrouter',
				model: 'meta-llama/llama-4-scout',
				baseUrl: 'https://openrouter.ai/api/v1',
				apiKey: '',
			};

		case 'anthropic':
			return {
				provider: 'anthropic',
				model: 'claude-3-5-sonnet-latest',
				baseUrl: 'https://api.anthropic.com/v1',
				apiKey: '',
			};

		case 'openai':
			return {
				provider: 'openai',
				model: 'gpt-4.1',
				baseUrl: 'https://api.openai.com/v1',
				apiKey: '',
			};

		case 'google':
			return {
				provider: 'google',
				model: 'gemini-2.0-flash',
				baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
				apiKey: '',
			};

		default:
			return {
				provider: 'custom',
				baseUrl: '',
				model: '',
				apiKey: '',
			};
	}
}

export function Setup() {
	const defaultCredentials: LLMCredentials = getDefaultCredentials(PUBLIC_MODEL_PROVIDED ? 'revivai' : 'openai');

	const { credentials, setCredentials } = useModel();
	const [isTesting, setIsTesting] = useState(false);
	const [credentialsForm, setCredentialsForm] = useState<LLMCredentials>(credentials ?? defaultCredentials);

	/**
	 * Change default values on provider change. Saves previous API key.
	 * @param provider The LLM provider to change the default values for
	 */
	const handleProviderChange = (provider: LLMProvider) => {
		setCredentialsForm((prev) => ({ ...getDefaultCredentials(provider), apiKey: prev.apiKey }));
	};

	/**
	 * Validate the LLM provider, try to send a request to the API
	 */
	const validate = async (credentialsForm: LLMCredentials) => {
		setIsTesting(true);

		try {
			const model = createModel(credentialsForm);
			const { object } = await generateObject({
				model: model,
				schema: z.object({ test: z.boolean() }),
				prompt: 'Set property "test" to "true". Use structured output.',
			});

			if (object.test !== true) {
				toast.error('Structured output is not supported by the models', { richColors: true });
				return false;
			}

			toast.error('Everything works as expected!');
			setCredentialsForm({ ...credentialsForm });
			setCredentials({ ...credentialsForm });
			return true;

		} catch (error) {
			console.error(error);
			toast.error('LLM is not responding correctly.', { description: `${error}`, richColors: true });
			setCredentialsForm({ ...credentialsForm });
		} finally {
			setIsTesting(false);
		}

		return false;
	};

	/**
	 * Submit the form
	 */
	const submit = async (credentialsForm: LLMCredentials) => {
		if (isTesting) return;

		// Ensure that the provider is tested before proceeding
		const accessible = await validate(credentialsForm);
		if (!accessible) return;

		// Check if URL has redirectToApp query param.
		const urlParams = new URLSearchParams(window.location.search);
		const redirectToProject = urlParams.get('redirectToProject');

		if (redirectToProject) {
			window.location.replace(`/app/${redirectToProject}`);
		} else {
			window.location.replace('/projects');
		}

	};

	/**
	 * Render the form for the selected LLM provider
	 * @param provider The LLM provider data
	 */
	const renderForm = (credentialsForm: LLMCredentials) => {
		return (
			<div className="space-y-4">
				<div>
					<Label>API URL</Label>
					<Input
						placeholder="https://api.openai.com/v1"
						className="mt-2"
						value={credentialsForm.baseUrl}
						onChange={(e) => {
							setCredentialsForm({ ...credentialsForm, baseUrl: e.target.value });
						}}
					/>
				</div>

				<div>
					<Label>Model</Label>
					<Input
						placeholder="gpt-4o"
						className="mt-2"
						value={credentialsForm.model}
						onChange={(e) => {
							setCredentialsForm({ ...credentialsForm, model: e.target.value });
						}}
					/>
				</div>

				<div>
					<Label className="mt-4">API Key</Label>
					<Input
						placeholder="sk-..."
						className="mt-2"
						value={credentialsForm.apiKey}
						type='password'
						onChange={(e) => {
							setCredentialsForm({ ...credentialsForm, apiKey: e.target.value });
						}}
					/>
				</div>

				{credentialsForm.provider === 'openai' && (
					<p className="text-sm text-muted-foreground">
						You can get OpenAI API Key, by going to{' '}
						<a href="https://platform.openai.com/api-keys" className="underline text-foreground">
							OpenAI Developer Portal
						</a>{' '}
						and generating a new API key.
					</p>
				)}
			</div>
		);
	};

	return (
		<div className="relative w-full flex justify-center items-center max-w-prose overflow-x-hidden px-6 pt-8 mb-16 mx-auto">
			<motion.div
				initial={{ opacity: 0, translateY: 8 }}
				animate={{ opacity: 1, translateY: 0 }}
				exit={{ opacity: 0, translateY: 8 }}
				transition={{ duration: 0.6, type: 'spring' }}
				className="flex flex-col p-4 gap-4 max-w-full"
			>
				<div className="mb-4">
					<h1 className="font-serif font-black text-xl mb-4">Choose your AI Provider!</h1>
					<p className="text-sm text-muted-foreground">
						To start using RevivAI, select your LLM provider. No worries - all LLM API calls are handled locally, so no credentials are sent to a third party.{' '}
					</p>
				</div>

				<Tabs className="flex-col" value={credentialsForm.provider} onValueChange={(value) => handleProviderChange(value as LLMProvider)}>
					<TabsList className="max-sm:flex-col max-sm:h-fit max-sm:w-full">
						{PUBLIC_MODEL_PROVIDED && (
							<TabsTrigger value="revivai" className="px-3">
								RevivAI
							</TabsTrigger>
						)}
						<TabsTrigger value="openrouter" className="px-3">
							OpenRouter
						</TabsTrigger>
						<TabsTrigger value="openai" className="px-3">
							OpenAI
						</TabsTrigger>
						<TabsTrigger value="anthropic" className="px-3">
							Anthropic
						</TabsTrigger>
						<TabsTrigger value="google" className="px-3">
							Google
						</TabsTrigger>
						<TabsTrigger value="custom" className="px-3">
							Custom
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div>{credentialsForm?.provider === 'revivai' ? <SetupBanner /> : renderForm(credentialsForm)}</div>

				<div className="flex gap-4 mt-12">
					<Button className="w-full" variant="outline" disabled={isTesting} onClick={() => validate(credentialsForm)}>
						{isTesting && <LoaderCircle className="animate-spin" />}
						Test
					</Button>

					<Button className="w-full" disabled={isTesting} onClick={() => submit(credentialsForm)}>
						Save & Continue
					</Button>
				</div>
			</motion.div>

			<Toaster position="bottom-right" closeButton />
		</div>
	);
}
