import type { GeneratedFile } from '@/hooks/useDb';
import { useMemo } from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { cn } from '@/lib/utils';

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

	// TODO: Fix
	const calculateProgress = (total: number, finished: number) => {
		if (total === 0) return 0;
		const progress = Math.floor((finished / total) * 100);
		return progress < 5 ? 5 : progress;
	};

	return (
		<div className="flex flex-col border rounded-md">
			{generationExports.map((exportItem) => (
				<div
					key={exportItem.id}
					className="flex justify-between items-start p-4 border-b border-border last:border-none"
				>
					<div className="flex flex-col w-full max-w-2/3 pr-4">
						<h2 className={cn('text-sm font-medium pb-0', exportItem.status === 'pending' && 'animate-pulse')}>
							{exportItem.status === 'pending' ? 'Generating...' : 'Done!'}
						</h2>

						<div className="mb-2 text-muted-foreground">
							{exportItem.status === 'pending' && (
								<Progress
									className="my-2 animate-pulse w-full"
									value={calculateProgress(exportItem.files.length, exportItem.completedFiles.length)}
								/>
							)}

							{exportItem.status === 'completed' && (
								<span className="text-xs">{exportItem.completedFiles.map((value) => value.fileName).join(', ')}</span>
							)}
						</div>

						<div className="text-xs text-muted-foreground">
							<span className="text-md">
								{exportItem.pendingFiles.length > 0
									? `${exportItem.completedFiles.length} / ${exportItem.files.length} files`
									: `${exportItem.files.length} files`}
							</span>

							<span className="mx-1 text-border">/</span>
							<span>{exportItem.createdAt.toLocaleString()}</span>
							<i className="ml-1">
								({formatDistanceToNow(exportItem.createdAt, { addSuffix: true, includeSeconds: true })})
							</i>
						</div>
					</div>

					<div className="flex gap-2">
						{exportItem.status === 'completed' && (
							<Button size="sm" variant="outline" onClick={() => onDownload(exportItem.id)}>
								Download
							</Button>
						)}
						<Button variant="outline" size="sm" onClick={() => onDelete(exportItem.id)}>
							<Trash2 className="text-destructive" />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}
