import { useState } from 'react';
import { FolderUp } from 'lucide-react';
import { useDb, type Codebase } from '@/hooks/useDb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Card } from '../ui/card';
import { useLiveQuery } from 'dexie-react-hooks';
import { UploadForm, type UploadFormSchema } from './upload-form';
import type { PromptifyFilesResult } from '@/actions/promptifyFiles';
import { useAtomValue } from 'jotai';
import { currentProjectIdAtom } from '@/hooks/useProjects';

export function Upload() {
	const projectId = useAtomValue(currentProjectIdAtom) as string;
	const { db, codebasePrompt } = useDb(projectId);
	const [isOpen, setIsOpen] = useState(false);

	const addCodebase = async (data: PromptifyFilesResult, form: UploadFormSchema) => {
		if (!data) return;

		const codebase: Codebase = {
			id: crypto.randomUUID() as string,
			type: form.type,
			createdAt: new Date(),
			prompt: data.prompt,
			repositoryUrl: form.type === 'remote' ? form.url : undefined,
			ignore: form.ignore ?? '',
			metadata: data.metadata,
		};

		await db.codebases.add(codebase);
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" round title="Upload code files">
					<FolderUp />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-3xl translate-y-0 top-8">
				<DialogHeader className="mb-4">
					<DialogTitle>Let's upload your code!</DialogTitle>
					<DialogDescription>Upload your project files from GitHub or from your local directory.</DialogDescription>
				</DialogHeader>

				<pre className="break-all">{JSON.stringify(codebasePrompt?.repositoryUrl)}</pre>
				<UploadForm onUploadSuccess={addCodebase} />

				{/* 					
					<div>
						<Card className="relative p-6 text-sm shadow-none space-y-2 bg-violet-600/10 border-violet-400/50  text-violet-800/80 dark:text-violet-200 gap-2 animate-in zoom-in-95">
							<h2 className="font-black text-xl font-serif">We offer a free LLM to test out RevivAI!</h2>
							<p>This is a great way to get started and see how RevivAI works. You can switch to a different LLM provider anytime through the settings!</p>
							<p>Please note that any code you upload will be processed by our LLMs, so don't upload any security-critical code or sensitive information.</p>
						</Card>
					</div> */}
			</DialogContent>
		</Dialog>
	);
}
