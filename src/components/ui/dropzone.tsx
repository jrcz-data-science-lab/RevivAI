import { cn } from '@/lib/utils';
import { FolderUp, LoaderPinwheel } from 'lucide-react';
import { useState } from 'react';

type DropzoneProps = React.ComponentProps<'div'> & {
	onDrop?: (files: FileList) => void;
	loading?: boolean;
};

export function Dropzone({ onDrop, loading = false, ...props }: DropzoneProps) {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && onDrop) onDrop(e.target.files);
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (onDrop && e.dataTransfer.files) onDrop(e.dataTransfer.files);
	};

	return (
		<div
			className={cn(
				'relative w-full min-h-48 min-w-80',
				'flex flex-col justify-center items-center',
				'border-2 border-dashed rounded-lg',
				'transition-colors duration-200 cursor-pointer',
				'border-neutral-500/30 hover:border-neutral-500',
				'group',
				loading && 'pointer-events-none',
				isDragging && 'border-neutral-500',
			)}
			{...props}
		>
			<input
				type="file"
				multiple={true}
				accept=".zip,.ts,.tsx,.md,.json,.js"
				onChange={handleChange}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn('cursor-pointer w-full h-full opacity-0 absolute top-0 left-0', loading && 'cursor-wait')}
			/>

			{loading ? (
				<>
					<LoaderPinwheel className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity animate-spin spin-in-180" />
					<p className="text-lg font-medium font-serif">Uploading...</p>
				</>
			) : (
				<>
					<FolderUp className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
					<p className="text-lg font-medium font-serif">Drop files here</p>
					<p className="text-sm opacity-50">or click to select</p>
				</>
			)}
		</div>
	);
}
