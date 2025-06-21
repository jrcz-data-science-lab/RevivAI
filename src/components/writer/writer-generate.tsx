import type { Database } from '@/hooks/useDb';
import type { LanguageModelV1 } from 'ai';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { InfoBar } from '../info-bar';
import { useLiveQuery } from 'dexie-react-hooks';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { WriterGenerateExports } from './writer-generate-exports';
import { downloadExportedFiles } from '@/lib/export';
import type { Codebase } from '@/hooks/useCodebase';

interface WriterGenerateProps {
	db: Database;
	model: LanguageModelV1;
	codebase: Codebase;
	isLoading: boolean;
	onGenerate: (exportId?: string) => void;
	onGenerationCancel: () => void;
}

/**
 * WriterGenerate component that handles the generation and export of documentation.
 */
export function WriterGenerate({
	db,
	model,
	codebase,
	isLoading,
	onGenerate,
	onGenerationCancel,
}: WriterGenerateProps) {
	// Get all generated content
	const generatedFiles = useLiveQuery(async () => {
		const generated = await db.generated.toArray();
		return generated.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	}, [db]);

	/**
	 * Download the generated export as a zip file.
	 * @param exportId - The ID of the export to download.
	 * @param renderDiagrams - Whether to render diagrams as SVG images or Mermaid code.
	 */
	const downloadExport = async (exportId: string, renderDiagrams: boolean) => {
		const generated = await db.generated.where('exportId').equals(exportId).toArray();
		if (generated.length === 0) {
			toast.error('No generated files found for this export.');
			return;
		}

		downloadExportedFiles(generated, renderDiagrams);
	};

	/**
	 * Delete the generated export from the database.
	 * @param exportId - The ID of the export to delete.
	 */
	const deleteExport = async (exportId: string) => {
		// Cancel export if its currently pending
		const pendingExports = await db.generated.where({ exportId }).toArray();
		const isPending = pendingExports.some((file) => file.status === 'pending');
		if (isPending) onGenerationCancel();

		await db.generated.where('exportId').equals(exportId).delete();
	};

	// True if files loaded from the database
	const filesLoaded = Array.isArray(generatedFiles);

	// Check if there are any generated files
	const hasExports = generatedFiles && generatedFiles.length > 0;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: filesLoaded ? 1 : 0 }}
			transition={{ duration: 0.15 }}
			className="space-y-8"
		>
			<div>
				<h1 className="text-xl font-serif font-black mb-1.5">Generate</h1>
				<p className="text-md text-muted-foreground">Here you can generate and export documentation.</p>
			</div>

			<div className="space-y-4">
				{hasExports && (
					<WriterGenerateExports
						generatedFiles={generatedFiles}
						onContinue={(id) => onGenerate(id)}
						onDelete={(id) => deleteExport(id)}
						onDownload={(id, renderDiagrams) => downloadExport(id, renderDiagrams)}
					/>
				)}
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3">
					<Button size="lg" onClick={() => onGenerate()} className="group" disabled={isLoading}>
						{isLoading ? (
							<LoaderCircle className="animate-spin" />
						) : (
							<Sparkles className="transition-transform group-hover:scale-120 group-hover:rotate-180" />
						)}
						Generate
					</Button>

					<InfoBar modelName={model.modelId} totalTokens={codebase.metadata.totalTokens} />
				</div>
			</div>
		</motion.div>
	);
}
