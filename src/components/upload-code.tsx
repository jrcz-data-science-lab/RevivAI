import { useState, useRef, type FormEvent, act } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { actions } from 'astro:actions';
import ShikiHighlighter from 'react-shiki';
import type { PackResult } from 'node_modules/repomix/lib/core/packager';
import { FileCode } from 'lucide-react';

export function UploadCode() {
	const [prompt, setPrompt] = useState<string>('');
	const [metadata, setMetadata] = useState<PackResult>();

	const [files, setFiles] = useState<FileList | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFiles(e.target.files);
			setUploadStatus('idle');
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!files || files.length === 0) return;

		setIsUploading(true);
		setUploadStatus('idle');

		try {
			const formData = new FormData();

			// Append all files to FormData
			for (let i = 0; i < files.length; i++) {
				formData.append('files', files[i], files[i].webkitRelativePath || files[i].name);
			}

			const { data, error } = await actions.promptify(formData);
			if (error) {
				throw new Error(error.message ?? 'Something wrong');
			}

			if (data.prompt) setPrompt(data.prompt);
			if (data.metadata) setMetadata(data.metadata);
			setUploadStatus('success');

			// Optional: Clear files after successful upload
			setFiles(null);
			if (inputRef.current) inputRef.current.value = '';
		} catch (error) {
			console.error('Error uploading files:', error);
			setUploadStatus('error');
		} finally {
			setIsUploading(false);
		}
	};

	const handleSelectFolder = () => {
		inputRef.current?.click();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 max-w-6xl w-full p-8 pb-16">
			<div className="flex flex-col items-center p-8 border-2 border-dashed rounded-lg border-input bg-muted/30">
				<input
					type="file"
					ref={inputRef}
					onChange={handleFileChange}
					className="hidden"
					// Enable multiple files and directory selection
					{...{ webkitdirectory: 'true', directory: '', multiple: true }}
				/>

				<div className="flex flex-col items-center gap-2 mb-4">
					<FileCode />
					<div className="text-center">
						<h3 className="font-medium">Upload your code</h3>
						<p className="text-sm text-muted-foreground">Select a folder containing your project files</p>
					</div>
				</div>

				<Button type="button" variant="outline" onClick={handleSelectFolder}>
					Choose Folder
				</Button>

				{files && files.length > 0 && (
					<div className="mt-4 text-sm">
						<p>
							{files.length} file{files.length !== 1 ? 's' : ''} selected
						</p>
					</div>
				)}
			</div>

			{uploadStatus === 'error' && <p className="text-sm text-destructive text-center">Failed to upload files. Please try again.</p>}

			{uploadStatus === 'success' && <p className="text-sm text-green-600 dark:text-green-500 text-center">Files uploaded successfully!</p>}

			<Button type="submit" className="w-full" disabled={!files || files.length === 0 || isUploading}>
				{isUploading ? 'Uploading...' : 'Upload Files'}
			</Button>

			{metadata && (
				<ShikiHighlighter language={'json'} as={'div'} addDefaultStyles={true} theme={'vitesse-dark'}>
					{JSON.stringify(metadata, null, 2)}
				</ShikiHighlighter>
			)}

			{prompt && (
				<ShikiHighlighter language={'markdown'} as={'div'} addDefaultStyles={true} theme={'vitesse-dark'}>
					{prompt}
				</ShikiHighlighter>
			)}
		</form>
	);
}
