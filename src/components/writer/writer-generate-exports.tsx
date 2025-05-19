import type { GeneratedFile } from '@/hooks/useDb';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { Progress } from '../ui/progress';
import { AnimatePresence, motion } from 'motion/react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { WriterPreview } from './writer-preview';

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
	const [previewExportId, setPreviewExportId] = useState<string | null>(null);

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

	/**
	 * Calculate the progress percentage based on the total and finished files.
	 * @param total - The total number of files.
	 * @param finished - The number of finished files.
	 * @returns The progress percentage.
	 */
	const calculateProgress = (total: number, finished: number) => {
		if (total === 0) return 0;
		const progress = Math.floor((finished / total) * 100);
		return progress < 5 ? 5 : progress;
	};

	// Set the content height for the animation
	const setContentHeight = (el: HTMLDivElement) => {
		if (el) {
			el.style.setProperty('--content-height', `${el.scrollHeight * 2}px`);
		}
	};

	return (
		<div className="flex flex-col border rounded-md">
			<AnimatePresence initial={false} mode="sync">
				{generationExports.map((exportItem) => (
					<motion.div
						key={exportItem.id}
						ref={setContentHeight}
						initial={{ maxHeight: 0 }}
						animate={{ maxHeight: 'var(--content-height, 1000px)' }}
						exit={{ maxHeight: 0 }}
						transition={{ duration: 0.15 }}
						className="flex justify-between items-start border-b border-border last:border-none overflow-hidden"
					>
						<div className="flex flex-col w-full max-w-2/3 p-4">
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

						<div className="flex p-4">
							<Button size="sm" variant="ghost" onClick={() => setPreviewExportId(exportItem.id)}>
								Preview
							</Button>

							{exportItem.status === 'completed' && (
								<Button size="sm" variant="ghost" onClick={() => onDownload(exportItem.id)}>
									Download
								</Button>
							)}
							<Button variant="ghost" size="sm" className="group" onClick={() => onDelete(exportItem.id)}>
								<Trash className="group-hover:text-destructive" />
							</Button>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			{previewExportId && (
				<WriterPreview
					open={!!previewExportId}
					onClose={() => setPreviewExportId(null)}
					files={generatedFiles.filter((f) => f.exportId === previewExportId)}
				/>
			)}
		</div>
	);
}
