import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useProjects } from '@/hooks/useProjects';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import OpenAI from 'openai';
import { useState } from 'react';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
import { Gift } from 'lucide-react';
import { SetupFreeBanner } from './setup-free-banner';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

export type LLMProviders = 'revivai' | 'openai' | 'ollama';

const testSchema = z.object({
	test: z.boolean(),
});

export function Setup() {
	const defaultProvider: LLMProviders = import.meta.env.PUBLIC_OLLAMA_API_URL ? 'revivai' : 'openai';
	const [selectedProvider, setSelectedProvider] = useState<LLMProviders>(defaultProvider);

	const [openaiKey, setOpenAIKey] = useState('');
	const [openaiUrl, setOpenAIUrl] = useState('https://api.openai.com/v1');
	const [openaiModel, setOpenAIModel] = useState('gpt-4o-mini');

	const [openaiProvider, setOpenAIProvider] = useState({
		url: 'https://api.openai.com/v1',
		model: 'gpt-4o',
		key: '',
	});

	const [ollamaProvider, setOllamaProvider] = useState({
		url: 'http://localhost:11434',
		model: 'llama2',
		key: '',
	});

	const publicAPI = import.meta.env.PUBLIC_OLLAMA_API_URL;

	const test = async (apiKey: string, model = 'gpt-4o-mini') => {
		const client = new OpenAI({
			baseURL: 'http://localhost:11434/v1',
			apiKey: openaiKey,
			dangerouslyAllowBrowser: true,
		});

		const x = await client.beta.chat.completions.parse({
			model: 'llama3.2',
			messages: [{ role: 'user', content: 'Respond with true in a test field.' }],
			response_format: zodResponseFormat(testSchema, 'testSchema'),
		});

		const response = x.choices[0]?.message.parsed;
		if (!response?.test) {
			console.error('LLM Responded, but something went wrong');
			return;
		}
		
		toast.success('Test successful! LLM is responding correctly.');
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
					<h1 className="font-serif font-black text-xl mb-4">Let's get started!</h1>
					<p className="text-sm text-muted-foreground">
						To begin using RevivAI, choose your LLM provider. No need to worry— all LLM API calls are handled locally, so your token stays secure.
					</p>
				</div>

				<div>
					<Tabs defaultValue={defaultProvider} onValueChange={(value: string) => setSelectedProvider(value as LLMProviders)}>
						{/* <Label className="mb-2">Your LLM provider</Label> */}

						<TabsList>
							{import.meta.env.PUBLIC_OLLAMA_API_URL && (
								<TabsTrigger value="revivai" className="px-3">
									RevivAI
								</TabsTrigger>
							)}
							<TabsTrigger value="openai" className="px-3">
								OpenAI
							</TabsTrigger>
							<TabsTrigger value="ollama" className="px-3">
								Ollama
							</TabsTrigger>
						</TabsList>

						<TabsContent value="revivai" className="mt-8">
							<SetupFreeBanner />
						</TabsContent>

						<TabsContent value="openai" className="mt-4 space-y-4">
							<div>
								<Label>API URL</Label>
								<Input placeholder="https://api.openai.com/v1" className="mt-2" value={'https://api.openai.com/v1'} />
							</div>

							<div>
								<Label>Model</Label>
								<Input placeholder="gpt-4o" className="mt-2" />
							</div>

							<div>
								<Label className="mt-4">API Key</Label>
								<Input placeholder="sk-..." className="mt-2" value={openaiKey} onChange={(e) => setOpenAIKey(e.target.value)} />
							</div>
						</TabsContent>

						<TabsContent value="ollama" className="mt-4 space-y-4">
							<div>
								<Label>Ollama URL</Label>
								<Input placeholder="https://api.openai.com/v1" className="mt-2" value={'https://api.openai.com/v1'} />
							</div>

							<div>
								<Label>Model</Label>
								<Input placeholder="llama3.2" className="mt-2" />
							</div>
						</TabsContent>
					</Tabs>
				</div>

				<div className="flex gap-4 mt-12">
					<Button className="w-full" onClick={test} variant="outline">
						Test
					</Button>

					<a href="/projects" className="w-full">
						<Button className="w-full">Continue</Button>
					</a>
				</div>
			</motion.div>

			<Toaster position="bottom-right" closeButton />
		</div>
	);
}
