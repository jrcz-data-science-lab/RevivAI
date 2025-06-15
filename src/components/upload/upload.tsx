import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FolderUp } from 'lucide-react';
import { useDb, type Codebase } from '@/hooks/useDb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { UploadForm, type UploadFormSchema } from './upload-form';
import type { PromptifyResult } from '@/actions/promptify';
import { atom, useAtom, useAtomValue } from 'jotai';
import { currentProjectIdAtom } from '@/hooks/useProjects';
import { UploadCodebase } from './upload-codebase';
import { useLiveQuery } from 'dexie-react-hooks';

// Is upload dialog open
export const isUploadOpenAtom = atom(false);

export function Upload() {
	const projectId = useAtomValue(currentProjectIdAtom) as string;
	const { db } = useDb(projectId);
	const [isOpen, setIsOpen] = useAtom(isUploadOpenAtom);

	// Get current active codebase
	const currentCodebase = useLiveQuery(() => db.codebases.orderBy('createdAt').last(), [db]);

	const addCodebase = async (data: PromptifyResult, form: UploadFormSchema) => {
		if (!data) return;

		const codebase: Codebase = {
			id: crypto.randomUUID() as string,
			type: form.type,
			createdAt: new Date(),
			prompt: data.prompt,
			compress: form.compress,
			repositoryUrl: form.type === 'remote' ? form.url : undefined,
			ignore: form.ignore ?? '',
			include: form.include ?? '',
			metadata: data.metadata,
		};

		// Clear previous codebases
		await db.codebases.clear();

		// Add a new one
		await db.codebases.add(codebase);

		toast.success('Codebase uploaded successfully!');
	};

	const removeCodebase = async () => {
		if (!currentCodebase) return;

		await db.codebases.delete(currentCodebase.id);
		toast.success('Previous codebase removed!');
	};

	// Only allow closing if there's a codebase or if opening the dialog
	const handleOpenChange = (open: boolean) => {
		if (open || currentCodebase) {
			setIsOpen(open);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button data-onboarding="upload-code" variant="ghost" size="icon" round title="Upload code files">
					<FolderUp />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-xl" hideClose={!currentCodebase} onEscapeKeyDown={(e) => !currentCodebase && e.preventDefault()} onPointerDownOutside={(e) => !currentCodebase && e.preventDefault()}>
				<DialogHeader className="mb-4">
					<DialogTitle>Let's upload your code!</DialogTitle>
					<DialogDescription>Upload your project files from GitHub or from your local directory.</DialogDescription>
				</DialogHeader>

				{currentCodebase ? (
					<UploadCodebase codebase={currentCodebase} onNewCodebase={removeCodebase} onDone={() => setIsOpen(false)} />
				) : (
					<UploadForm onUploadSuccess={addCodebase} />
				)}
			</DialogContent>
		</Dialog>
	);
}
