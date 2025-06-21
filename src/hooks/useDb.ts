import Dexie, { type EntityTable } from 'dexie';
import type { Codebase } from './useCodebase';
import type { Chapter, GeneratedFile } from './useWriter';

export type Database = ReturnType<typeof createDatabase>;

/**
 * Creates a new Dexie database instance for the given project ID.
 * @param projectId The ID of the project
 * @returns A Dexie database instance with the specified schema
 */
export function createDatabase(projectId: string) {
	const key = `revivai-${projectId}`;
	console.log('Creating database with key:', key);

	const db = new Dexie(key) as Dexie & {
		chapters: EntityTable<Chapter, 'id'>;
		codebases: EntityTable<Codebase, 'id'>;
		generated: EntityTable<GeneratedFile, 'id'>;
	};

	// Schema declaration:
	db.version(1).stores({
		chapters: '++id, index',
		codebases: '++id, createdAt',
		generated: '++id, chapterId, status, exportId, fileName',
	});

	return db;
}

// Global database instance
let db: Database;

/**
 * Get database instance for the given project ID
 * @param projectId The ID of the project
 */
export function useDb(projectId: string) {
	if (!db) db = createDatabase(projectId);
	return { db };
}
