import type { GeneratedFile } from '@/hooks/useDb';
import { zipSync, strToU8 } from 'fflate';
import { renderMermaidInMarkdown } from './mermaid';

/**
 * Download exported files as a zip archive or individual files.
 * @param files The list of generated files to download.
 * @param renderDiagrams Whether to pre-render diagrams.
 * @returns A promise that resolves when the download is complete.
 */
export async function downloadExportedFiles(files: GeneratedFile[], renderDiagrams = true) {
	if (files.length === 0) return;

	// Check if there are any files to download
	if (files.length === 1) {
		const file = files[0];
		const content = renderDiagrams ? await renderMermaidInMarkdown(file.content) : file.content;

		const blob = new Blob([content], { type: 'text/plain' });
		downloadFile(file.fileName, blob);
		return;
	}

	// Create archive for multiple files
	const exportStructure: Record<string, Uint8Array> = {};
	for (const { fileName, content } of files) {
		if (renderDiagrams) {
			const markdown = await renderMermaidInMarkdown(content);
			exportStructure[fileName] = strToU8(markdown);
			continue;
		}

		exportStructure[fileName] = strToU8(content);
	}

	// Download the archive
	const archiveName = `${files.at(0)?.exportId || 'documentation'}.zip`;
	const zipFile = zipSync(exportStructure, { level: 0, mtime: new Date() });
	const blob = new Blob([zipFile], { type: 'application/zip' });
	downloadFile(archiveName, blob);
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
