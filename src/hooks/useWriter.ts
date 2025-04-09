import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface ProjectMetadata {
	id: string;
	name: string;
	createdAt: string;
}

export function useWriter(projectId: string) {
	// return { createProject, deleteProject, projects };
}
