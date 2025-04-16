import { memo } from 'react';
import { Button } from './ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

function Settings() {
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
					<div className="space-y-3">
						<Label>Change Model</Label>
						<p className="text-sm text-muted-foreground">Change the LLM AI provider, used by RevivAI. Can be done on the starting setup screen. </p>
						<a href="/setup">
							<Button variant="outline" size="sm">
								Go to Setup
							</Button>
						</a>
					</div>

					<div className="space-y-3">
						<Label>Delete Project</Label>
						<p className="text-sm text-muted-foreground">Delete all information about current project</p>
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
