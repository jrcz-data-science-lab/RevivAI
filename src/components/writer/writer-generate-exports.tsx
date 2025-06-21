import type { GeneratedFile } from '@/hooks/useDb';
import { cn, colorHash } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { Progress } from '../ui/progress';
import { AnimatePresence, color, motion } from 'motion/react';
import { format } from 'date-fns/format';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { WriterPreview } from './writer-preview';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface WriterGenerateExportsProps {
	generatedFiles: GeneratedFile[];
	onDownload: (exportId: string, renderDiagrams: boolean) => void;
	onDelete: (chapterId: string) => void;
	onContinue: (exportId: string) => void;
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
export function WriterGenerateExports({
	generatedFiles,
	onDownload,
	onContinue,
	onDelete,
}: WriterGenerateExportsProps) {
	const [previewExportId, setPreviewExportId] = useState<string | null>(null);

	// Generate generations list by grouping generated files
	const generationExports = useMemo(() => {
		const exportsIds = generatedFiles.map((file) => file.exportId);
		const uniqueExportsIds = [...new Set(exportsIds)];

		const structuredExports: StructuredExport[] = [];
		for (const exportId of uniqueExportsIds) {
			const exportFiles = generatedFiles.filter((file) => file.exportId === exportId);
			if (exportFiles.length === 0) continue;

			const completedFiles = exportFiles.filter((file) => file.status === 'completed');
			const pendingFiles = exportFiles.filter((file) => file.status === 'pending');
			const failedFiles = exportFiles.filter((file) => file.status === 'failed');

			let status: StructuredExport['status'] = 'completed';
			if (failedFiles.length > 0) status = 'failed';
			if (pendingFiles.length > 0) status = 'pending';

			structuredExports.push({
				id: exportId,
				status: status,
				completedFiles,
				pendingFiles,
				createdAt: exportFiles[0].createdAt,
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
		return progress < 1 ? 1 : progress;
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
				{generationExports.map((exportItem, index) => (
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
							<h2
								className={cn(
									'text-sm font-medium',
									exportItem.status === 'pending' && 'animate-pulse',
									exportItem.status === 'failed' && 'text-destructive',
								)}
							>
								{exportItem.status === 'completed' && 'Completed'}
								{exportItem.status === 'pending' && 'Generating...'}
								{exportItem.status === 'failed' && 'Failed'}
							</h2>

							<div className="mb-2 text-muted-foreground">
								{exportItem.status === 'pending' && (
									<Progress
										className="my-3 animate-pulse w-full duration-[5s]"
										value={calculateProgress(exportItem.files.length, exportItem.completedFiles.length)}
									/>
								)}

								{exportItem.status === 'completed' && (
									<span className="text-xs">{exportItem.completedFiles.map((value) => value.fileName).join(', ')}</span>
								)}

								{exportItem.status === 'failed' && (
									<span className="text-xs">
										Generation failed. This can happen due to page reload, network issues, or model errors. You can try
										to continue generation or delete this export.
									</span>
								)}
							</div>

							<div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
								<span className={cn('inline-block size-2 rounded-full', colorHash(exportItem.id))} />

								<span className="text-border">/</span>
								<span className="text-md">
									{exportItem.status === 'pending' || exportItem.status === 'failed'
										? `${exportItem.completedFiles.length} / ${exportItem.files.length} files`
										: `${exportItem.files.length} files`}
								</span>

								<span className="text-border">/</span>
								<span>
									<span className="mr-1.5">{format(exportItem.createdAt, 'EEE dd MMMM, HH:mm')}</span>
									<i>({formatDistanceToNow(exportItem.createdAt, { addSuffix: true, includeSeconds: true })})</i>
								</span>
							</div>
						</div>

						<div className="flex p-4">
							{exportItem.status === 'failed' && (
								<Button size="sm" variant="outline" onClick={() => onContinue(exportItem.id)}>
									Continue
								</Button>
							)}

							<Button size="sm" variant="ghost" onClick={() => setPreviewExportId(exportItem.id)}>
								Preview
							</Button>

							{exportItem.status === 'completed' && (
								<Popover>
									<PopoverTrigger>
										<Button size="sm" variant="ghost">
											Download
										</Button>
									</PopoverTrigger>
									<PopoverContent className="mr-4 min-w-80">
										<h4 className="font-bold">Diagrams</h4>
										<p className="text-muted-foreground mb-3 text-sm">
											Select which diagram format should be used in the exported documentation.
										</p>

										<div className="flex gap-2">
											<Button size="sm" variant="outline" onClick={() => onDownload(exportItem.id, false)}>
												Mermaid Code
											</Button>
											<Button size="sm" variant="outline" onClick={() => onDownload(exportItem.id, true)}>
												Rendered SVGs
											</Button>
										</div>
									</PopoverContent>
								</Popover>
							)}

							<Button variant="ghost" size="sm" className="group" onClick={() => onDelete(exportItem.id)}>
								<Trash className="group-hover:text-destructive" />
							</Button>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			<WriterPreview
				open={!!previewExportId}
				onClose={() => setPreviewExportId(null)}
				files={generatedFiles.filter((f) => f.exportId === previewExportId)}
			/>
		</div>
	);
}
