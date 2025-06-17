import { atom, useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface ProjectMetadata {
	id: string;
	name: string;
	createdAt: string;
}

// Current project ID
export const currentProjectIdAtom = atom<string>();

// This atom stores the projects in local storage
export const projectsAtom = atomWithStorage<ProjectMetadata[]>('projects', []);

/**
 * Custom hook to manage projects.
 * @returns An object with methods to create, delete, and check if a project exists.
 */
export function useProjects() {
	const currentProjectId = useAtomValue(currentProjectIdAtom);
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

		return newProject;
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

	/**
	 * Check if a project exists.
	 * @param id The ID of the project to check
	 */
	const isProjectExists = (id: string) => {
		return projects.some((project) => project.id === id);
	};

	return { currentProjectId, createProject, deleteProject, projects, isProjectExists };
}
