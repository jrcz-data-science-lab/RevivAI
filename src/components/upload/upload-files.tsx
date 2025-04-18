import { useRef, useState } from 'react';
import { FolderUp, LoaderPinwheel } from 'lucide-react';
import { cn } from '@/lib/utils';

type DropzoneProps = React.ComponentProps<'div'> & {
	onChange: (files: FileList) => void;
	message?: string;
	loading?: boolean;
};

export function UploadFiles({ onChange, message, loading = false, ...props }: DropzoneProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && onChange) onChange(e.target.files);
	};

	const handleClick = () => {
		if (fileInputRef.current) fileInputRef.current.click();
	};

	return (
		<div
			className={cn(
				'relative w-full min-h-38 min-w-80',
				'flex flex-col justify-center items-center',
				'border-2 border-dashed rounded-lg',
				'transition-colors duration-200 cursor-pointer',
				'border-border hover:border-muted-foreground',
				'group',
				loading && 'pointer-events-none',
			)}
			onClick={handleClick}
			{...props}
		>
			<input
				ref={fileInputRef}
				type="file"
				multiple={true}
				onChange={handleChange}
				className="hidden"
				{...{ webkitdirectory: '', directory: '' }}
			/>

			{loading ? (
				<>
					<LoaderPinwheel className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity animate-spin spin-in-180" />
					<p className="text-lg font-medium font-serif">Uploading...</p>
				</>
			) : (
				<>
					<FolderUp className="mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
					<p className="text-sm font-medium mb-1">{message ?? 'Upload your code'}</p>
					<p className="text-xs opacity-50">Select a folder containing your project files</p>
				</>
			)}
		</div>
	);
}
