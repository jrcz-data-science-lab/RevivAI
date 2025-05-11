import { downloadFile } from '@/lib/utils';
import { Button } from '../ui/button';
import { zipSync, strToU8 } from 'fflate';
import { LoaderCircle, Sparkles } from 'lucide-react';
import type { WriterGenerateConfig } from '@/hooks/useWriter';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Database } from '@/hooks/useDb';
import { useLiveQuery } from 'dexie-react-hooks';
import type { LanguageModelV1 } from 'ai';
import { WriterGenerateExports } from './writer-generate-exports';

interface WriterGenerateProps {
	db: Database;
	model: LanguageModelV1;
	isLoading: boolean;
	onGenerate: (config: WriterGenerateConfig) => void;
}

const generateConfigAtom = atomWithStorage<WriterGenerateConfig>('generate-config', {
	diagrams: 'mermaid',
});

/**
 * WriterGenerate component that handles the generation and export of documentation.
 */
export function WriterGenerate({ db, model, isLoading, onGenerate }: WriterGenerateProps) {
	const [config, setConfig] = useAtom(generateConfigAtom);

	// Get all generated content
	const generatedFiles = useLiveQuery(() => db.generated.toArray(), [db]);

	/**
	 * Download the generated export as a zip file.
	 */
	const downloadExport = async (exportId: string) => {
		const generated = await db.generated.where('exportId').equals(exportId).toArray();
		if (!generated) return;

		const archiveStructure: Record<string, Uint8Array> = {};
		for (const item of generated) {
			archiveStructure[item.fileName.trim()] = strToU8(item.content);
		}

		const archiveName = 'documentation.zip';

		const zipFile = zipSync(archiveStructure, { level: 0, mtime: new Date() });
		const blob = new Blob([zipFile], { type: 'application/zip' });
		downloadFile(archiveName, blob);
	};

	/**
	 * Delete the generated export from the database.
	 * @param exportId - The ID of the export to delete.
	 */
	const deleteExport = async (exportId: string) => {
		await db.generated.where('exportId').equals(exportId).delete();
	};

	// Check if there are any generated files
	const hasExports = generatedFiles && generatedFiles.length > 0;

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-xl font-serif font-black mb-1.5">Generate</h1>
				<p className="text-md text-muted-foreground">Here you can generate and export your documentation.</p>

				<div className="text-xs text-muted-foreground mt-4">
					Model: <b>{model.modelId}</b>
				</div>
			</div>

			<div className="space-y-4">
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

				{hasExports && (
					<WriterGenerateExports
						generatedFiles={generatedFiles}
						onDelete={(id) => deleteExport(id)}
						onDownload={(id) => downloadExport(id)}
					/>
				)}
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex gap-3">
					<Button size="lg" onClick={() => onGenerate(config)} className="group" disabled={isLoading}>
						{isLoading ? (
							<LoaderCircle className="animate-spin" />
						) : (
							<Sparkles className="transition-transform group-hover:scale-120 group-hover:rotate-180" />
						)}
						Generate
					</Button>
				</div>
			</div>
		</div>
	);
}
