import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { useProjects } from '@/hooks/useProjects';
import { ProjectsList } from './projects-list';

export function Projects() {
	const { projects, createProject, deleteProject } = useProjects();

	return <ProjectsList projects={projects} deleteProject={deleteProject}  />
}
