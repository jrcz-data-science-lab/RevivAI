import type { Chapter } from '@/hooks/useDb';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

interface WriterEditorProps {
	chapter: Chapter;
}

export function WriterEditor({ chapter }: WriterEditorProps) {
	return (
		<Collapsible defaultOpen={true} className="w-full">
			{/* <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger> */}
			<CollapsibleContent>
				<div className="flex flex-col space-y-6" key={chapter.id}>
					<div className="flex flex-col gap-2">
						<Label htmlFor="chapter-title" className="text-sm font-semibold">
							Title
						</Label>
						<Input id="chapter-title" placeholder="Chapter title" defaultValue={chapter.title} />
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="chapter-title" className="text-sm font-semibold">
							Chapter Description
						</Label>

						<Textarea placeholder="" defaultValue={chapter.content} />
					</div>

					<div className="w-full flex justify-end">
						<Button>Generate Chapter</Button>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	);
}
