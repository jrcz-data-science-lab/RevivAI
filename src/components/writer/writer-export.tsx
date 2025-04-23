import { Button } from '../ui/button';

export function WriterExport() {
	return (
		<div>
			<h1 className="text-xl font-serif font-black">Export</h1>
			<p className='text-md text-muted-foreground'>Here, you can generate & export your documentation for later usage.</p>

			<Button className="mt-4">Export Archive</Button>
		</div>
	);
}
