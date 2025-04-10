import { useMemo } from 'react';
import { Trash } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button';
import type { ProjectMetadata } from '@/hooks/useProjects';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';

interface ProjectsListProps {
	projects: ProjectMetadata[];
	deleteProject: (projectId: string) => void;
}

/**
 * List of projects that user can select from.
 */
export function ProjectsList({ projects, deleteProject }: ProjectsListProps) {
	if (projects.length === 0) return;
	
	// Sort projects by createdAt date
	const sortedProjects = useMemo(() => {
		return projects.sort((a, b) => {
			const dateA = new Date(a.createdAt);
			const dateB = new Date(b.createdAt);
			return dateB.getTime() - dateA.getTime();
		});
	}, [projects]);

	return (
		<div className={cn('border border-border rounded-md overflow-hidden mb-8', sortedProjects.length === 0 && 'hidden')}>
			<AnimatePresence initial={false}>
				{sortedProjects.map((project) => {
					const createdAt = new Date(project.createdAt);
					const createdAtFormatted = formatDistanceToNow(createdAt, { addSuffix: true, includeSeconds: true });

					return (
						<motion.div
							key={project.id}
							initial={{ maxHeight: 0 }}
							animate={{ maxHeight: 48 }}
							exit={{ maxHeight: 0, border: 0 }}
							transition={{ duration: 0.2, type: 'spring' }}
							className="not-last:border-b border-border overflow-hidden"
						>
							<div className="relative group flex justify-between items-center pr-2 pl-4 transition-all min-h-12">
								<a
									href={`/app/${project.id}`}
									className="opacity-70 group-hover:opacity-100 block w-5/6 py-3 max-w-sm cursor-pointer overflow-hidden whitespace-nowrap overflow-ellipsis"
								>
									{project.name}
								</a>

								<span className="text-xs italic right-4 absolute opacity-40 text-right group-hover:opacity-0 group-hover:-translate-y-2 transition-all">
									Created {createdAtFormatted}
								</span>

								<div className="group-hover:opacity-100 group-hover:translate-y-0 opacity-0 transition-all translate-y-2">
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
						</motion.div>
					);
				})}
			</AnimatePresence>
		</div>
	);
}
