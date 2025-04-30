import { atom } from 'jotai';
import { useMemo } from 'react';
import Dexie, { type EntityTable } from 'dexie';
import type { PackResult } from 'node_modules/repomix/lib/core/packager';
import { useLiveQuery } from 'dexie-react-hooks';

export type Database = ReturnType<typeof createDatabase>;

export interface Chapter {
	id: string;
	index: number;
	title: string;
	description: string;
	content: string;
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
	};

	// Schema declaration:
	db.version(1).stores({
		chapters: '++id, index, title, content',
		codebases: '++id, createdAt',
		chatMessages: '++id, createdAt, question, answer',
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
	// Initialize the database instance if it doesn't exist
	if (!db) db = createDatabase(projectId);

	// Current uploaded codebase
	const currentCodebase = useLiveQuery(() => db.codebases.orderBy('createdAt').last(), [db]);

	return { db, currentCodebase };
}
