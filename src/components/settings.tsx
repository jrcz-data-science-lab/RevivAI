import { currentProjectIdAtom, useProjects } from '@/hooks/useProjects';
import { useSettings } from '@/hooks/useSettings';
import { type LanguageName, languages } from '@/lib/languages';
import { atom, useAtom, useAtomValue } from 'jotai';
import { SlidersHorizontal } from 'lucide-react';
import { memo } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const isSettingsOpenedAtom = atom(false);

function Settings() {
	const [isOpen, setIsOpen] = useAtom(isSettingsOpenedAtom);
	const { currentProjectId, deleteProject } = useProjects();
	const { settings, setLanguage, setParallelization, setTemperature } = useSettings();

	const handleDeleteProject = async () => {
		if (!currentProjectId) return;

		if (confirm('Are you sure you want to delete this project?')) {
			deleteProject(currentProjectId);
			window.location.href = '/';
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="overflow-y-scroll max-w-2xl">
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

						<Select value={settings.language} onValueChange={(value) => setLanguage(value as LanguageName)}>
							<SelectTrigger className="w-fit">
								<SelectValue placeholder="Language" />
							</SelectTrigger>
							<SelectContent className="max-h-80">
								{Object.entries(languages).map(([key, [name]]) => (
									<SelectItem key={key} value={key}>
										{name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex justify-between gap-4">
						<div className="max-w-2/3">
							<Label>Temperature</Label>
							<p className="text-muted-foreground">
								Temperature of the LLM. Higher values make the output more random, lower values make it more
								deterministic.
							</p>
						</div>

						<Input
							type="number"
							value={settings.temperature}
							onChange={(e) => setTemperature(Number(e.target.value))}
							min={0}
							max={2}
							step={0.1}
							className="w-20"
							placeholder="0.7"
						/>
					</div>

					<div className="flex justify-between gap-4">
						<div className="max-w-2/3">
							<Label>Parallelization</Label>
							<p className="text-muted-foreground">
								The maximum number of chapters that can be processed in parallel. Increases generation speed, but may
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

						<a href={`/setup?redirectToProject=${currentProjectId}`}>
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

						<Button variant="destructive" size="sm" onClick={handleDeleteProject}>
							Delete Project
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default memo(Settings);
