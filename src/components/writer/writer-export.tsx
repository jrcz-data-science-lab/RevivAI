import type { Chapter } from '@/lib/db';
import { useState } from 'react';
import { AnimatePresence, motion, Reorder } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Download, FileText, LibraryBig, Plus, Settings, Trash } from 'lucide-react';

export function WriterExport() {
	return (
		<div>
			<h1 className="text-xl font-serif font-black">Export</h1>
			<p className='text-md text-muted-foreground'>Here, you can generate & export your documentation for later usage.</p>

			<Button className="mt-4">Export Archive</Button>
		</div>
	);
}
