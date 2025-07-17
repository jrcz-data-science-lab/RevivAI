import { useLiveQuery } from 'dexie-react-hooks';
import type { PackResult } from 'node_modules/repomix/lib/core/packager';
import type { Database } from './useDb';

interface UseCodebaseProps {
	db: Database;
}

export type CodebaseType = 'files' | 'remote';

export interface Codebase {
	id: string;
	createdAt: Date;
	ignore: string;
	include: string;
	prompt: string;
	compress: boolean;
	type: CodebaseType;
	repositoryUrl?: string;
	metadata: PackResult;
}

export function useCodebase({ db }: UseCodebaseProps) {
	const codebase = useLiveQuery(() => db.codebases.orderBy('createdAt').last());

	/**
	 * Removes the current codebase from the database.
	 */
	const removeCodebase = async () => {
		if (!codebase) return;
		await db.codebases.clear();
	};

	/**
	 * Adds a new codebase to the database.
	 * @param newCodebase The codebase to add.
	 */
	const addCodebase = async (newCodebase: Codebase) => {
		if (!newCodebase) return;
		await db.codebases.clear();
		await db.codebases.add(newCodebase);
	};

	return { codebase, removeCodebase, addCodebase };
}
