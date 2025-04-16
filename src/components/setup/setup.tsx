import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { use, useState } from 'react';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { SetupBanner } from './setup-banner';
import { Toaster } from '@/components/ui/toaster';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { SetupForm } from './setup-form';
import { createOpenAIClient, testOpenAIClient } from '@/lib/openai';
import { llmCredentialsAtom, type LLMCredentials, type LLMProvider } from '@/hooks/useLLM';
import { useAtom } from 'jotai';

const PUBLIC_MODEL_PROVIDED = !!import.meta.env.PUBLIC_LLM_API_URL;

/**
 * Get the default credentials for the selected LLM provider
 * @param provider The LLM provider to get the credentials for
 */
function getDefaultCredentials(provider: LLMProvider): LLMCredentials {
	switch (provider) {
		case 'revivai':
			return {
				name: 'revivai',
				baseUrl: import.meta.env.PUBLIC_LLM_API_URL,
				apiKey: import.meta.env.PUBLIC_LLM_API_KEY,
				model: import.meta.env.PUBLIC_LLM_API_MODEL,
				valid: false,
			};

		case 'openrouter':
			return {
				name: 'openrouter',
				model: 'llama3.2',
				baseUrl: 'https://openrouter.ai/api/v1',
				apiKey: '',
				valid: false,
			};

		case 'openai':
			return {
				name: 'openai',
				model: 'gpt-4o',
				baseUrl: 'https://api.openai.com/v1',
				apiKey: '',
				valid: false,
			};

		case 'google':
			return {
				name: 'google',
				model: 'gemini-2.0-flash',
				baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
				apiKey: '',
				valid: false,
			};

		default:
			return {
				name: 'custom',
				baseUrl: '',
				model: '',
				apiKey: '',
				valid: false,
			};
	}
}

export function Setup() {
	const defaultCredentials: LLMCredentials = getDefaultCredentials(PUBLIC_MODEL_PROVIDED ? 'revivai' : 'openrouter');

	const [isTesting, setIsTesting] = useState(false);
	// const [isProviderAccessible, setIsProviderAccessible] = useState(false);

	const [credentials, setCredentials] = useAtom(llmCredentialsAtom);
	const [credentialsForm, setCredentialsForm] = useState<LLMCredentials>(credentials ?? defaultCredentials);

	const handleProviderChange = (provider: LLMProvider) => {
		setCredentialsForm(getDefaultCredentials(provider));
	};

	/**
	 * Test the LLM provider, try to send a request to the API
	 */
	const validate = async (credentialsForm: LLMCredentials) => {
		setIsTesting(true);

		const client = createOpenAIClient(credentialsForm.baseUrl, credentialsForm.apiKey);
		const { success, error } = await testOpenAIClient(client, credentialsForm.model);

		setIsTesting(false);

		if (!success) {
			console.error(error);
			toast.error('LLM is not responding correctly.', { description: `${error}`, richColors: true });
			setCredentialsForm({ ...credentialsForm, valid: false });
			return false;
		}

		toast.success('Success! LLM is responding correctly.', {});
		setCredentialsForm({ ...credentialsForm, valid: true });
		setCredentials({ ...credentialsForm, valid: true });

		return true;
	};

	/**
	 * Submit the form
	 */
	const submit = async (credentialsForm: LLMCredentials) => {
		if (isTesting) return;

		// Ensure that the provider is tested before proceeding
		if (!credentialsForm.valid) {
			const accessible = await validate(credentialsForm);
			if (!accessible) return;

			window.location.href = '/projects';
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
							setCredentialsForm({ ...credentialsForm, baseUrl: e.target.value, valid: false });
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
							setCredentialsForm({ ...credentialsForm, model: e.target.value, valid: false });
						}}
					/>
				</div>

				<div>
					<Label className="mt-4">API Key</Label>
					<Input
						placeholder="sk-..."
						className="mt-2"
						value={credentialsForm.apiKey}
						onChange={(e) => {
							setCredentialsForm({ ...credentialsForm, apiKey: e.target.value, valid: false });
						}}
					/>
				</div>
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

				<Tabs className="flex-col" value={credentialsForm.name} onValueChange={(value) => handleProviderChange(value as LLMProvider)}>
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
						<TabsTrigger value="google" className="px-3">
							Google
						</TabsTrigger>
						<TabsTrigger value="custom" className="px-3">
							Custom
						</TabsTrigger>
					</TabsList>
				</Tabs>

				<div>{credentialsForm?.name === 'revivai' ? <SetupBanner /> : renderForm(credentialsForm)}</div>

				<div className="flex gap-4 mt-12">
					<Button className="w-full" variant="outline" disabled={isTesting} onClick={() => validate(credentialsForm)}>
						{isTesting && <LoaderCircle className="animate-spin" />}
						Test
					</Button>

					<Button className="w-full" disabled={isTesting} onClick={() => submit(credentialsForm)}>
						Continue
					</Button>
				</div>
			</motion.div>

			<Toaster position="bottom-right" closeButton />
		</div>
	);
}
