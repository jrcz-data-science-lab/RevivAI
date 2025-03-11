import { useRef, useState } from 'react';
import { FolderUp, LoaderPinwheel } from 'lucide-react';
import { cn } from '@/lib/utils';

type DropzoneProps = React.ComponentProps<'div'> & {
	onFilesDrop?: (files: FileList) => void;
	loading?: boolean;
	acceptDirectories?: boolean;
};

export function Dropzone({ 
	onFilesDrop, 
	loading = false, 
	acceptDirectories = true,
	...props 
}: DropzoneProps) {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	};
	
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && onFilesDrop) onFilesDrop(e.target.files);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		
		if (onFilesDrop && e.dataTransfer.files.length > 0) onFilesDrop(e.dataTransfer.files);
	};

	const handleClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
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
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={handleClick}
			{...props}
		>
			
			<input
				ref={fileInputRef}
				type="file"
				multiple={true}
				{...(acceptDirectories ? { webkitdirectory: "", directory: "" } : {})}
				accept=".zip,.ts,.tsx,.md,.json,.js,.html,.css"
				onChange={handleChange}
				className="hidden"
			/>

			{loading ? (
				<>
					<LoaderPinwheel className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity animate-spin spin-in-180" />
					<p className="text-lg font-medium font-serif">Uploading...</p>
				</>
			) : (
				<>
					<FolderUp className="mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
					<p className="text-lg font-medium font-serif">Drop folder with your code</p>
					<p className="text-sm opacity-50">or click to select</p>
				</>
			)}
		</div>
	);
}
