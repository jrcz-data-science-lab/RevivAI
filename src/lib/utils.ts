import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple tailwind class names into a single string.
 * @param inputs The class names to combine.
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Download a file with the given filename and blob data.
 * @param filename The name of the file to download.
 * @param blob The blob data to download.
 */
export function downloadFile(filename: string, blob: Blob) {
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.style.display = 'none';
	a.href = url;
	a.download = filename;
	
	try {
		document.body.appendChild(a);
		a.click();
	} finally {
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
}