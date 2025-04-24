import { Button } from '../ui/button';
import { zipSync, strToU8 } from 'fflate';

export function WriterExport() {
	const createArchive = async () => {
		const zipData = new Uint8Array();
		const zipFile = zipSync({ 'README.md': strToU8('# Hello World!') }, { level: 0, mtime: new Date() });

		const blob = new Blob([zipFile], { type: 'application/zip' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'archive.zip';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div>
			<h1 className="text-xl font-serif font-black">Export</h1>
			<p className="text-md text-muted-foreground">
				Here, you can generate & export your documentation for later usage.
			</p>

			<Button className="mt-4" onClick={createArchive}>
				Export Archive
			</Button>
		</div>
	);
}
