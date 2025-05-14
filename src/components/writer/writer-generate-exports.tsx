import type { GeneratedFile } from '@/hooks/useDb';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { LoaderCircle, Trash2 } from 'lucide-react';

interface WriterGenerateExportsProps {
	generatedFiles: GeneratedFile[];
	onDownload: (exportId: string) => void;
	onDelete: (chapterId: string) => void;
}

interface StructuredExport {
	id: string;
	status: 'pending' | 'completed' | 'failed';
	createdAt: Date;
	pendingFiles: GeneratedFile[];
    completedFiles: GeneratedFile[];
	files: GeneratedFile[];
}

/**
 * WriterGenerateExports component that displays the generated exports and allows downloading and deleting them.
 * @param generatedFiles - The list of generated files.
 * @param onDownload - Callback function to handle download action.
 * @param onDelete - Callback function to handle delete action.
 */
export function WriterGenerateExports({ generatedFiles, onDownload, onDelete }: WriterGenerateExportsProps) {
	// Check if there are any generated files
	const generationExports = useMemo(() => {
		const exportsIds = generatedFiles.map((file) => file.exportId);
		const uniqueExportsIds = [...new Set(exportsIds)];

		const structuredExports: StructuredExport[] = [];
		for (const exportId of uniqueExportsIds) {
			const exportFiles = generatedFiles.filter((file) => file.exportId === exportId);
			if (exportFiles.length === 0) continue;

			const completedFiles = exportFiles.filter((file) => file.status === 'completed');
            const pendingFiles = exportFiles.filter((file) => file.status === 'pending');

			// If any of files are pending, set status to pending
			const status = completedFiles.length === exportFiles.length ? 'completed' : 'pending';

			structuredExports.push({
				id: exportId,
				status: status,
                completedFiles,
                pendingFiles,
				createdAt: exportFiles.at(-1)?.createdAt ?? new Date(),
				files: exportFiles,
			});
		}

		return structuredExports;
	}, [generatedFiles]);

	return (
		<div className="flex flex-col border rounded-md">
			{generationExports.map((exportItem) => (
				<div
					key={exportItem.id}
					className="flex justify-between items-center p-4 border-b border-border last:border-none"
				>
					<div className="flex flex-col">
						{exportItem.status === 'pending' && (
							<span className="text-md font-medium animate-pulse">
								{exportItem.completedFiles.length} / {exportItem.files.length} files
								completed...
							</span>
						)}

						{exportItem.status === 'completed' && <span className="text-md font-medium">Export Completed!</span>}

						<span className="text-xs text-muted-foreground">
							<span>{exportItem.files.length} files</span>
							<span className="mx-1 text-muted">/</span>
							<span>{exportItem.createdAt.toLocaleString()}</span>
						</span>
					</div>

					<div className="flex gap-2">
						{exportItem.status === 'completed' && (
							<Button size="sm" variant="outline" onClick={() => onDownload(exportItem.id)}>
								Download
							</Button>
						)}
						<Button variant="destructive" size="sm" onClick={() => onDelete(exportItem.id)}>
							<Trash2 />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
