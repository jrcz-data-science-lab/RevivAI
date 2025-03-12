import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useProjects } from '@/hooks/useProjects';
import { ProjectList } from './project-list';

export function Projects() {
	const { projects, createProject, deleteProject } = useProjects();

	return (
		<div className="relative w-full h-full max-w-xl px-6 pt-8 mb-16 mx-auto">
			<motion.div
				initial={{ opacity: 0, translateY: 8 }}
				animate={{ opacity: 1, translateY: 0 }}
				transition={{ duration: 0.6, type: 'spring', delay: 0.3 }}
				className="flex flex-col p-4 gap-4"
			>
				<div className="mb-4">
					<h1 className="font-serif font-black text-2xl mb-4">Welcome back!</h1>
					<p className="text-sm opacity-70">
						Select project you are going to work with. You can always submit new project by clicking button below.
					</p>
				</div>

				<ProjectList projects={projects} deleteProject={deleteProject} />

				<Button
					className="block ml-auto"
					onClick={() => {
						createProject({ name: 'New project sdfshd fuwiufwefu heifweihu' });
					}}
				>
					Upload New
				</Button>
			</motion.div>
		</div>
	);
}
