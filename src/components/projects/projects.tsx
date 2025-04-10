import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsList } from './projects-list.tsx';

export function Projects() {
	const { projects, createProject, deleteProject } = useProjects();

	const newProject = () => {
		const created = createProject({ name: 'New Project' });
		window.location.href = `/app/${created.id}`;
	}

	return (
		<div className="relative w-full flex justify-center items-center max-w-prose overflow-x-hidden px-6 pt-8 mb-16 mx-auto">
			<motion.div
				initial={{ opacity: 0, translateY: 8 }}
				animate={{ opacity: 1, translateY: 0 }}
				exit={{ opacity: 0, translateY: 8 }}
				transition={{ duration: 0.6, type: 'spring' }}
				className="flex flex-col p-4 gap-4"
			>
				<div className="mb-4">
					<h1 className="font-serif font-black text-xl mb-4">Welcome back!</h1>
					<p className="text-sm opacity-70">Select project you are going to work with. You can always submit new project by clicking button below.</p>
				</div>

				<ProjectsList projects={projects} deleteProject={deleteProject} />

				<Button className="block ml-auto" onClick={newProject}>
					New Project
				</Button>
			</motion.div>
		</div>
	);
}
