import { memo } from 'react';
import { Button } from './ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useAtomValue } from 'jotai';
import { currentProjectIdAtom } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

function Settings() {
	const projectId = useAtomValue(currentProjectIdAtom);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" round size="icon" title="Settings">
					<SlidersHorizontal />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] overflow-y-scroll">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>

				<div className="space-y-6 mt-4">
					<div className="flex justify-between gap-4 items-center">
						<div className="max-w-2/3">
							<Label>Language</Label>
							<p className="text-sm text-muted-foreground">
								Used by LLM to write chat responses and documentation in a specified language.
							</p>
						</div>

						<Select value="english" onValueChange={(value) => console.log(value)}>
							<SelectTrigger className="w-fit">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="english">English</SelectItem>
								<SelectItem value="dutch">Dutch</SelectItem>
								<SelectItem value="french">French</SelectItem>
								<SelectItem value="german">German</SelectItem>
								<SelectItem value="italian">Italian</SelectItem>
								<SelectItem value="japanese">Japanese</SelectItem>
								<SelectItem value="russian">Russian</SelectItem>
								<SelectItem value="polish">Polish</SelectItem>
								<SelectItem value="latvian">Latvian</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex justify-between gap-4 items-center">
						<div className="max-w-2/3">
							<Label>Change Model</Label>
							<p className="text-sm text-muted-foreground">
								Change the LLM AI provider, used by RevivAI. Can be done on the starting setup screen.{' '}
							</p>
						</div>

						<a href={`/setup?redirectToProject=${projectId}`}>
							<Button variant="outline" size="sm">
								Go to Setup
							</Button>
						</a>
					</div>

					<div className="flex justify-between gap-4 items-center">
						<div className="max-w-2/3">
							<Label>Delete Project</Label>
							<p className="text-sm text-muted-foreground">Delete all information about current project.</p>
						</div>

						<Button variant="destructive" size="sm">
							Delete Project
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default memo(Settings);
