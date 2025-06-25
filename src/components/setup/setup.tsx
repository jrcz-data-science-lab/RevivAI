import type { LLMCredentials, LLMProvider } from '@/hooks/useModel';
import { motion } from 'motion/react';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { SetupHelp } from './setup-help';
import { SetupBanner } from './setup-banner';
import { LoaderCircle } from 'lucide-react';
import { getDefaultCredentials, useSetup } from '@/hooks/useSetup';

// True if the public model is provided
const PUBLIC_MODEL_PROVIDED = !!import.meta.env.PUBLIC_OLLAMA_API_URL;

/**
 * Setup component that handles the setup of the LLM provider.
 */
export function Setup() {
	const { submit, credentialsForm, handleProviderChange, isTesting, setCredentialsForm, validate } = useSetup();
	
	/**
	 * Render the form for the selected LLM provider
	 * @param provider The LLM provider data
	 */
	const renderForm = (credentialsForm: LLMCredentials) => {
		const { baseUrl, model } = getDefaultCredentials(credentialsForm.provider);

		return (
			<div className="space-y-4">
				<div>
					<Label>API URL</Label>
					<Input
						placeholder={baseUrl || 'https://api.openai.com/v1'}
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
						placeholder={model || 'gpt-4.1-mini'}
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
						type="password"
						onChange={(e) => {
							setCredentialsForm({ ...credentialsForm, apiKey: e.target.value });
						}}
					/>
				</div>

				<SetupHelp provider={credentialsForm.provider} />
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
						To start using RevivAI, select your LLM provider. No worries - all LLM API calls are handled locally, so no
						credentials are sent to a third party.{' '}
					</p>
				</div>

				<Tabs
					className="flex-col"
					value={credentialsForm.provider}
					onValueChange={(value) => handleProviderChange(value as LLMProvider)}
				>
					<TabsList className="max-sm:flex-col max-sm:h-fit max-sm:w-full">
						{PUBLIC_MODEL_PROVIDED && (
							<TabsTrigger value="revivai" className="px-3">
								RevivAI
							</TabsTrigger>
						)}
						<TabsTrigger value="openai" className="px-3">
							OpenAI
						</TabsTrigger>
						<TabsTrigger value="anthropic" className="px-3">
							Anthropic
						</TabsTrigger>
						<TabsTrigger value="google" className="px-3">
							Google
						</TabsTrigger>
						<TabsTrigger value="openrouter" className="px-3">
							OpenRouter
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
