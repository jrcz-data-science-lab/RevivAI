import { useModel } from '@/hooks/useModel.ts';
import { useProjects } from '@/hooks/useProjects';
import { motion } from 'motion/react';
import Title from '../title.tsx';
import { ProjectsList } from './projects-list.tsx';
import ProjectsNew, { type ProjectNewFormSchema } from './projects-new.tsx';

export function Projects() {
	const { projects, createProject, deleteProject } = useProjects();
	const { credentials } = useModel();

	const createNewProject = (data: ProjectNewFormSchema) => {
		const created = createProject({ name: data.projectName });

		// If no model specified
		if (!credentials) {
			window.location.href = `/setup?redirectToProject=${created.id}`;
			return;
		}

		window.location.href = `/app/${created.id}`;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 8 }}
			transition={{ duration: 0.6, type: 'spring' }}
			className="flex flex-col p-4 gap-4 max-w-prose py-16 z-50"
		>
			<div className="flex flex-col mb-12 -mt-8 space-y-8 w-full">
				<Title />
			</div>

			<ProjectsList projects={projects} deleteProject={deleteProject} />

			<ProjectsNew onCreate={createNewProject} />
		</motion.div>
	);
}
