import { useState } from 'react';
import { Dropzone } from '@/components/ui/dropzone';
import { Button } from '@/components/ui/button';
import { UploadContent } from './upload-content';
import { AnimatedText } from '../ui/animated-text';
import { motion } from 'motion/react';
import { FolderUp, UploadCloud } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { UploadForm } from './upload-form';
import { Form } from '../ui/form';

type FileWithContent = {
	path: string;
	content: string;
	type: string;
};

export function Upload() {
	return (
        <div className='relative w-full h-full overflow-y-auto'>
		<Dialog open={true}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" round title="Upload code files">
					<FolderUp />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Lets upload your code!</DialogTitle>
					<DialogDescription>Click on the area below to select folder with your projects code files. You can select multiple files at once.</DialogDescription>
				</DialogHeader>

				<div>

					<UploadForm />
					{/* <UploadForm /> */}
				</div>
			</DialogContent>
		</Dialog>
        </div>
	);
}
