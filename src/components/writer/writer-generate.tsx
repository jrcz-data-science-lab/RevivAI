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

interface WriterGenerateProps {
	db: Database;
	model: LanguageModelV1;
	isLoading: boolean;
	onGenerate: () => void;
}

/**
 * WriterGenerate component that handles the generation and export of documentation.
 */
export function WriterGenerate({ db, model, isLoading, onGenerate }: WriterGenerateProps) {

	// Get all generated content
	const generatedFiles = useLiveQuery(async () => {
		const generated = await db.generated.toArray();
		return generated.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	}, [db]);

	/**
	 * Download the generated export as a zip file.
	 */
	const downloadExport = async (exportId: string, renderDiagrams = true) => {
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
		await db.generated.where('exportId').equals(exportId).delete();
	};

	const filesLoaded = Array.isArray(generatedFiles);

	// Check if there are any generated files
	const hasExports = generatedFiles && generatedFiles.length > 0;

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: filesLoaded ? 1 : 0 }} className="space-y-8">
			<div>
				<h1 className="text-xl font-serif font-black mb-1.5">Generate</h1>
				<p className="text-md text-muted-foreground">Here you can generate and export your documentation.</p>
			</div>

			<div className="space-y-4">
				{hasExports && (
					<WriterGenerateExports
						generatedFiles={generatedFiles}
						onDelete={(id) => deleteExport(id)}
						onDownload={(id) => downloadExport(id)}
					/>
				)}

				{/* <div className="flex justify-between border p-4 gap-6 rounded-md">
					<div>
						<Label className="text-md">Generate Diagrams</Label>
						<p className="text-md text-muted-foreground">
							Allow to generate diagrams in your documentation. You can choose between Mermaid code blocks or prerender
							them as SVG images.
						</p>
					</div>

					<Select
						value={config.diagrams}
						onValueChange={(value) => setConfig({ ...config, diagrams: value as WriterGenerateConfig['diagrams'] })}
					>
						<SelectTrigger className="w-38">
							<SelectValue placeholder="Diagrams" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="svg">SVG Images</SelectItem>
							<SelectItem value="mermaid">Mermaid Code</SelectItem>
							<SelectItem value="none">None</SelectItem>
						</SelectContent>
					</Select>
				</div> */}
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

					<InfoBar modelName={model.modelId} />
				</div>
			</div>
		</motion.div>
	);
}
