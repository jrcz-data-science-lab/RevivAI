import { createDatabase } from '@/lib/db';
import { atom } from 'jotai';
import { useMemo } from 'react';

export type Database = ReturnType<typeof createDatabase>;

/**
 * Get database instance for the given project ID
 * @param projectId The ID of the project
 */
export function useDb(projectId: string) {
	const db = useMemo(() => createDatabase(projectId), [projectId]);
	return { db };
}
