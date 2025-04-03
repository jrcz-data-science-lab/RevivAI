import { useState, useRef, type FormEvent, act } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

import { actions } from 'astro:actions';
import ShikiHighlighter from 'react-shiki';

export function UploadCode() {
    const [prompt, setPrompt] = useState('');
    const [metadata, setMetadata] = useState('');

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

			// const response = await fetch('/api/upload', {
			//     method: 'POST',
			//     body: formData,
			// });

			// if (!response.ok) {
			//     throw new Error('Upload failed');
			// }

			setPrompt(data?.prompt);
            setMetadata(data?.metadata);
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
				<input type="file" ref={inputRef} onChange={handleFileChange} className="hidden" webkitdirectory="true" directory="" multiple />

				<div className="flex flex-col items-center gap-2 mb-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="size-10 text-muted-foreground"
					>
						<path d="M20 11h-6m3-3l3 3-3 3" />
						<path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h8.5L20 7.5V10" />
						<path d="M14 2v6h6" />
					</svg>
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
					{JSON.stringify(metadata, '  ', 2)}
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
