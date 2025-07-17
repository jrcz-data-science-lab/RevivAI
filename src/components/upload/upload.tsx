import type { PromptifyResult } from '@/actions/promptify';
import { useCodebase } from '@/hooks/useCodebase';
import type { Database } from '@/hooks/useDb';
import { atom, useAtom } from 'jotai';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { UploadCodebase } from './upload-codebase';
import { UploadForm, type UploadFormSchema } from './upload-form';

export interface UploadProps {
	db: Database;
}

// Is upload dialog open
export const isUploadOpenAtom = atom(false);

export function Upload({ db }: UploadProps) {
	const { codebase, removeCodebase, addCodebase } = useCodebase({ db });
	const [isOpen, setIsOpen] = useAtom(isUploadOpenAtom);

	const onUpload = async (data: PromptifyResult, form: UploadFormSchema) => {
		if (!data) return;

		await addCodebase({
			id: crypto.randomUUID() as string,
			type: form.type,
			createdAt: new Date(),
			prompt: data.prompt,
			compress: form.compress,
			repositoryUrl: form.type === 'remote' ? form.url : undefined,
			ignore: form.ignore ?? '',
			include: form.include ?? '',
			metadata: data.metadata,
		});

		setIsOpen(false);
		toast.success('Codebase uploaded successfully!');
	};

	// Only allow closing if there's a codebase or if opening the dialog
	const handleOpenChange = (open: boolean) => {
		if (!codebase) {
			setIsOpen(true);
			return;
		}

		setIsOpen(open);
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent
				className="max-w-xl"
				hideClose={!codebase}
				onEscapeKeyDown={(e) => !codebase && e.preventDefault()}
				onPointerDownOutside={(e) => !codebase && e.preventDefault()}
			>
				<DialogHeader className="mb-4">
					<DialogTitle>Let's upload your code!</DialogTitle>
					<DialogDescription>Upload your project files from GitHub or from your local directory.</DialogDescription>
				</DialogHeader>

				{codebase ? (
					<UploadCodebase codebase={codebase} onNewCodebase={removeCodebase} onDone={() => setIsOpen(false)} />
				) : (
					<UploadForm onUploadSuccess={onUpload} />
				)}
			</DialogContent>
		</Dialog>
	);
}
