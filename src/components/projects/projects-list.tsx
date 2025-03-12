import type { ProjectMetadata } from '@/hooks/useProjects';
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface ProjectsListProps {
    projects: ProjectMetadata[];
    deleteProject: (projectId: string) => void;
}

export function ProjectsList({ projects, deleteProject }: ProjectsListProps) {
	const sortedProjects = projects.sort((a, b) => {
		const dateA = new Date(a.createdAt);
		const dateB = new Date(b.createdAt);
		return dateB.getTime() - dateA.getTime();
	});

	return (
		<div className="border border-muted rounded-md overflow-hidden mb-8">
			{sortedProjects.map((project) => {
				const createdAt = new Date(project.createdAt);
				const createdAtFormatted = formatDistanceToNow(createdAt, { addSuffix: true, includeSeconds: true });

				return (
					<div
						key={project.id}
						className="relative group flex justify-between items-center pr-2 pl-4 not-last:border-b border-muted transition-all"
					>
						<a
							href={`/app?projectId=${project.id}`}
							className="opacity-70 group-hover:opacity-100 block w-5/6 py-3 max-w-1/2 cursor-pointer overflow-hidden whitespace-nowrap overflow-ellipsis"
						>
							{project.name}
						</a>

						<span className="text-xs italic right-4 absolute opacity-40 text-right group-hover:opacity-0 group-hover:-translate-y-2 transition-all">
							Created {createdAtFormatted}
						</span>

						<div className='group-hover:opacity-100 group-hover:translate-y-0 opacity-0 transition-all translate-y-2'>
							<Button
								variant="link"
								size="icon"
								onClick={() => deleteProject(project.id)}
								className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
							>
								<Trash />
							</Button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
