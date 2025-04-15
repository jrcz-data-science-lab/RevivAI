import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import OpenAI from 'openai';
import { use, useState } from 'react';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { SetupBanner } from './setup-banner';
import { Toaster } from '@/components/ui/toaster';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { useLLMProvider, type LLMProvider, type LLMProviderData } from '@/hooks/useLLM';
import { SetupForm } from './setup-form';
import { createOpenAIClient, testOpenAIClient } from '@/lib/openai';

const testSchema = z.object({
	test: z.boolean(),
});

export function Setup() {
	const defaultProviderName: LLMProvider = import.meta.env.PUBLIC_OLLAMA_API_URL ? 'revivai' : 'openrouter';

	const llmProvider = useLLMProvider();

	const [isTesting, setIsTesting] = useState(false);
	const [isProviderAccessible, setIsProviderAccessible] = useState(false);

	const [provider, setProvider] = useState<LLMProviderData>({
		name: defaultProviderName,
		model: 'gpt-4o',
		baseUrl: 'https://api.openai.com/v1',
		apiKey: '',
	});

	const handleProviderChange = (provider: LLMProvider) => {
		switch (provider) {
			case 'revivai':
				setProvider({
					name: 'revivai',
					baseUrl: import.meta.env.PUBLIC_OLLAMA_API_URL,
					apiKey: 'ollama',
					model: 'llama3.2',
				});
				break;
			case 'openrouter':
				setProvider((current) => ({
					...current,
					name: 'openrouter',
					model: 'llama3.2',
					baseUrl: 'https://openrouter.ai/api/v1',
				}));
				break;
			case 'openai':
					setProvider((current) => ({
						...current,
						name: 'openai',
						model: 'gpt-4o',
						baseUrl: 'https://api.openai.com/v1',
					}));
				break;
			case 'google':
				setProvider((current) => ({
					...current,
					name: 'google',
					model: 'gemini-2.0-flash',
					baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
				}));
				break;
			case 'custom':
				setProvider((current) => ({
					...current,
					name: 'custom',
					baseUrl: '',
				}));
				break;
		}
	}

	/**
	 * Test the LLM provider
	 *
	 */
	const test = async (provider: LLMProviderData) => {
		setIsTesting(true);

		const client = createOpenAIClient(provider.baseUrl, provider.apiKey);
		const { success, error } = await testOpenAIClient(client, provider.model);

		setIsTesting(false);

		if (!success) {
			console.error(error);
			toast.error('LLM is not responding correctly.', { description: `${error}`, richColors: true });
			setIsProviderAccessible(false);
			return false;
		} 

		toast.success('Success! LLM is responding correctly.', {});
		setIsProviderAccessible(true);
		return true;
	};

	/**
	 * Submit the form
	 */
	const submit = async (provider: LLMProviderData) => {
		if (isTesting) return;

		// Ensure that the provider is tested before proceeding
		if (!isProviderAccessible) {
			const accessible = await test(provider);
			if (!accessible) return;
		}
	}

	/**
	 * Render the form for the selected LLM provider
	 * @param provider The LLM provider data
	 */
	const renderForm = (provider: LLMProviderData) => {
		return (
			<div className='space-y-4'>
				<div>
					<Label>API URL</Label>
					<Input
						placeholder="https://api.openai.com/v1"
						className="mt-2"
						value={provider.baseUrl}
						onChange={(e) => {
							setIsProviderAccessible(false);
							setProvider({ ...provider, baseUrl: e.target.value });
						}}
					/>
				</div>

				<div>
					<Label>Model</Label>
					<Input placeholder="gpt-4o" className="mt-2" value={provider.model} onChange={(e) => {
						setIsProviderAccessible(false);
						setProvider({ ...provider, model: e.target.value });
					}} />
				</div>

				<div>
					<Label className="mt-4">API Key</Label>
					<Input placeholder="sk-..." className="mt-2" value={provider.apiKey} onChange={(e) => {
						setIsProviderAccessible(false);
						setProvider({ ...provider, apiKey: e.target.value });
					}} />
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

				<Tabs className='flex-col' value={provider.name} onValueChange={(value) => handleProviderChange(value as LLMProvider)}>
					<TabsList className='max-sm:flex-col max-sm:h-fit max-sm:w-full'>
						{import.meta.env.PUBLIC_OLLAMA_API_URL && (
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

				<div>{provider.name === 'revivai' ? <SetupBanner /> : renderForm(provider)}</div>

				<div className="flex gap-4 mt-12">
					<Button className="w-full" variant="outline" disabled={isTesting} onClick={() => test(provider)}>
						{isTesting && <LoaderCircle className="animate-spin" />}
						Test
					</Button>

					<Button className="w-full" disabled={isTesting} onClick={() => submit(provider)}>
						Continue
					</Button>
				</div>
			</motion.div>

			<Toaster position="bottom-right" closeButton />
		</div>
	);
}
