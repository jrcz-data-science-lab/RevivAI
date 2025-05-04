import Dexie, { type EntityTable } from 'dexie';
import type { PackResult } from 'node_modules/repomix/lib/core/packager';

export type Database = ReturnType<typeof createDatabase>;

export interface Chapter {
	id: string;
	index: number;
	title: string;
	outline: string;
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

export interface GeneratedFile {
	id: string;
	generationId: string;
	chapterId: string;
	createdAt: Date;
	fileName: string;
	content: string;
}

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
		generated: '++id, chapterId, generationId, fileName',
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
