import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsList } from './projects-list.tsx';
import ProjectsNew, { type ProjectNewFormSchema } from './projects-new.tsx';
import Title from '../title.tsx';

export function Projects() {
	const { projects, createProject, deleteProject } = useProjects();

	const createNewProject = (data: ProjectNewFormSchema) => {
		const created = createProject({ name: data.projectName });
		window.location.href = `/app/${created.id}`;
	};

	return (
		<motion.div
			initial={{ opacity: 0, translateY: 8 }}
			animate={{ opacity: 1, translateY: 0 }}
			exit={{ opacity: 0, translateY: 8 }}
			transition={{ duration: 0.6, type: 'spring' }}
			className="flex flex-col p-4 gap-4 max-w-prose py-16"
		>
			<div className="mb-12">
				<Title />
			</div>

			<div className="mb-4">
				<h1 className="font-serif font-black text-xl mb-4">Welcome back!</h1>
				<p className="text-sm text-muted-foreground">
					Select project you are going to work with. You can always submit new project by clicking button below.
				</p>
			</div>

			<ProjectsList projects={projects} deleteProject={deleteProject} />

			<ProjectsNew onCreate={createNewProject} />
		</motion.div>
	);
}
