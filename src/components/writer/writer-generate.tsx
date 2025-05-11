import { downloadFile } from '@/lib/utils';
import { Button } from '../ui/button';
import { zipSync, strToU8 } from 'fflate';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { WriterGenerateConfig } from '@/hooks/useWriter';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Database } from '@/hooks/useDb';
import { useLiveQuery } from 'dexie-react-hooks';
import type { LanguageModelV1 } from 'ai';

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

	const generated = useLiveQuery(() => db.generated.toArray(), [db]);

	const createArchive = async () => {
		const generated = await db.generated.toArray();
		if (!generated) return;

		const archiveStructure: Record<string, Uint8Array> = {};
		for (const item of generated) {
			archiveStructure[item.fileName] = strToU8(item.content);
		}

		const archiveName = 'documentation.zip';

		const zipFile = zipSync(archiveStructure, { level: 0, mtime: new Date() });
		const blob = new Blob([zipFile], { type: 'application/zip' });
		downloadFile(archiveName, blob);
	};

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
				<div className="flex justify-between border p-4 gap-6 rounded-md">
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
				</div>
			</div>
{/* 
			<div className="w-full border border-border rounded-md">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Id</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-medium">INV001</TableCell>
							<TableCell>6 May 2025</TableCell>
							<TableCell>Credit Card</TableCell>
							<TableCell className="text-right">$250.00</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div> */}

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

					{generated?.length && (
						<>
							<Button size="lg" variant="outline" onClick={createArchive}>
								Download
							</Button>
							<Button size="lg" variant="outline" onClick={() => db.generated.clear()}>
								Delete
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
