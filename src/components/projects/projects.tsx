import { motion } from 'motion/react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsList } from './projects-list.tsx';
import ProjectsNew, { type ProjectNewFormSchema } from './projects-new.tsx';
import Title from '../title.tsx';
import { useModel } from '@/hooks/useModel.ts';
import { Upload } from '../upload/upload.tsx';

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
			initial={{ opacity: 0, translateY: 8 }}
			animate={{ opacity: 1, translateY: 0 }}
			exit={{ opacity: 0, translateY: 8 }}
			transition={{ duration: 0.6, type: 'spring' }}
			className="flex flex-col p-4 gap-4 max-w-prose py-16"
		>
			<div className="mb-12">
				<Title />
			</div>

			<ProjectsList projects={projects} deleteProject={deleteProject} />

			<ProjectsNew onCreate={createNewProject} />
		</motion.div>
	);
}
