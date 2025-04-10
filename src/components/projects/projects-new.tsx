import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '../ui/input';

interface ProjectsNewProps {
    onCreate: () => void;
}

function ProjectsNew({ onCreate }: ProjectsNewProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="block ml-auto">
					New Project
				</Button>
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] overflow-y-scroll">
				<DialogHeader>
					<DialogTitle>Submit your code files</DialogTitle>
					<DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
				</DialogHeader>

				<div>
                    <h2>Project Name</h2>
                    <Input />
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default memo(ProjectsNew);
