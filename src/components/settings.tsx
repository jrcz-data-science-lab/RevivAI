import { memo } from 'react';
import { Button } from './ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useAtomValue } from 'jotai';
import { currentProjectIdAtom } from '@/hooks/useProjects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useSettings, type Language } from '@/hooks/useSettings';

function Settings() {
	const projectId = useAtomValue(currentProjectIdAtom);
	const { settings, setLanguage, setParallelization } = useSettings();

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
					<div className="flex justify-between gap-4">
						<div className="max-w-2/3">
							<Label>Language</Label>
							<p className="text-muted-foreground">
								Used by LLM to write chat responses and documentation in a specified language.
							</p>
						</div>

						<Select value={settings.language} onValueChange={(value) => setLanguage(value as Language)}>
							<SelectTrigger className="w-fit">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="en">English</SelectItem>
								<SelectItem value="nl">Dutch</SelectItem>
								<SelectItem value="ru">Russian</SelectItem>
								<SelectItem value="lv">Latvian</SelectItem>
								<SelectItem value="la">Latin</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex justify-between gap-4">
						<div className="max-w-2/3">
							<Label>Parallelization</Label>
							<p className="text-muted-foreground">
								Parallelize the generation of documentation files. This will speed up the generation process, but may
								trigger rate limits.
							</p>
						</div>

						<Select value={`${settings.parallelization}`} onValueChange={(value) => setParallelization(Number(value))}>
							<SelectTrigger className="w-fit">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="1">Disabled</SelectItem>
								<SelectItem value="2">2</SelectItem>
								<SelectItem value="4">4</SelectItem>
								<SelectItem value="8">8</SelectItem>
								<SelectItem value="999">Unlimited</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex justify-between gap-4">
						<div className="max-w-2/3">
							<Label>Change Model</Label>
							<p className="text-muted-foreground">
								Change the LLM AI provider, used by RevivAI. Can be done on the starting setup screen.{' '}
							</p>
						</div>

						<a href={`/setup?redirectToProject=${projectId}`}>
							<Button variant="outline" size="sm">
								Go to Setup
							</Button>
						</a>
					</div>

					<div className="flex justify-between gap-4">
						<div className="max-w-2/3">
							<Label>Delete Project</Label>
							<p className="text-muted-foreground">Delete all information about current project.</p>
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
