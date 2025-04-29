import type { Database } from '@/hooks/useDb';

export async function applyReadmeTemplate(db: Database) {
    await db.chapters.clear();

}