import { useState } from 'react';
import { Dropzone } from '@/components/ui/dropzone';
import { Button } from '@/components/ui/button';
import { UploadContent } from './upload-content';
import { AnimatedText } from '../ui/animated-text';
import { motion } from 'motion/react';
import { UploadCloud } from 'lucide-react';

type FileWithContent = {
	path: string;
	content: string;
	type: string;
};

export function UploadForm() {
	const [files, setFiles] = useState<FileWithContent[]>([]);
	const [loading, setLoading] = useState(false);

	const handleDrop = async (fileList: FileList) => {
		setLoading(true);
		const fileArray: FileWithContent[] = [];

		try {
			for (let i = 0; i < fileList.length; i++) {
				const file = fileList[i];
				// Use webkitRelativePath for directory uploads, fallback to name for individual files
				const path = file.webkitRelativePath || file.name;

				try {
					const content = await readFileContent(file);
					fileArray.push({
						path,
						content,
						type: file.type || 'text/plain',
					});
				} catch (error) {
					console.error(`Error reading file ${file.name}:`, error);
				}
			}

			setFiles(fileArray);
		} catch (error) {
			console.error('Error processing files:', error);
		} finally {
			setLoading(false);
		}
	};

	const readFileContent = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (event) => resolve(event.target?.result as string);
			reader.onerror = (error) => reject(error);

			if (file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/') || file.name.endsWith('.zip')) {
				// For binary files, just note the file type
				resolve(`[${file.type || 'binary'} file, size: ${(file.size / 1024).toFixed(2)} KB]`);
			} else {
				reader.readAsText(file);
			}
		});
	};

	const clearFiles = () => {
		setFiles([]);
	};

	return (
		<div className="space-y-4">
			<Dropzone onFilesDrop={handleDrop} loading={loading} />

			{/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: files.length > 0 ? 1 : 0 }} transition={{ duration: 0.3 }} className="mt-4">

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-sm">Uploaded files ({files.length})</h2>
						<Button variant="outline" size="sm" onClick={clearFiles}>
							Clear
						</Button>
					</div>
					
					<UploadContent files={files} />
				</div>

				<Button size="lg" className="mx-auto flex">
					Upload
					<UploadCloud className="mr-1 scale-125" />
				</Button>
			</motion.div> */}
		</div>
	);
}
