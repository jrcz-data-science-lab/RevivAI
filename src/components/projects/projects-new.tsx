import type { ProjectMetadata } from '@/hooks/useProjects';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface ProjectsNewProps {
	projects: ProjectMetadata[];
	deleteProject: (projectId: string) => void;
}

export function ProjectsNew({ projects, deleteProject }: ProjectsNewProps) {
	return (
		<div>
            
		</div>
	);
}
