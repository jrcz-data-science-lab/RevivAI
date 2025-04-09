import Dexie, { type EntityTable } from 'dexie';

export interface Chapter {
	id: string;
	index: number;
	title: string;
	content: string;
}

export interface Codebase {
	id: string;
	createdAt: string;
	content: string;
}

export interface ChatMessage {
	id: string;
	createdAt: string;
	question: string;
	answer: string;
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
		chatMessages: EntityTable<ChatMessage, 'id'>;
	};

	// Schema declaration:
	db.version(1).stores({
		chapters: '++id, index, title, content',
		codebases: '++id, createdAt, content',
		chatMessages: '++id, createdAt, question, answer',
	});

	return db;
}
