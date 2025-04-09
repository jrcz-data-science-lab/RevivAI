import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface ProjectMetadata {
	id: string;
	name: string;
	createdAt: string;
}

const projectsAtom = atomWithStorage<ProjectMetadata[]>('revivai-projects', [{ id: crypto.randomUUID(), name: 'sdfsdf', createdAt: new Date().toISOString() }]);

export function useProjects() {
	const [projects, setProjects] = useAtom(projectsAtom);

	/**
	 * Create a new project.
	 * @param project The project metadata
	 */
	const createProject = (project: { name: string }) => {
		const newProject: ProjectMetadata = {
			...project,
			id: crypto.randomUUID(),
			createdAt: new Date().toISOString(),
		};

		setProjects((projects) => [...projects, newProject]);
	};

	/**
	 * Delete a project.
	 * @param id The ID of the project to delete
	 */
	const deleteProject = (id: string) => {
		setProjects((projects) => {
			return projects.filter((project) => project.id !== id);
		});
	};

	return { createProject, deleteProject, projects };
}
