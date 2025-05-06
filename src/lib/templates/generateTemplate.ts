import type { Database } from '@/hooks/useDb';
import { generateText, streamObject, type LanguageModelV1 } from 'ai';
import { chapterSchema } from '../schemas';
import WriterGenerateStructure from '@/lib/prompts/writer-generate.md?raw';

// IDEA: Run first time, ask llm to generate topics worth documenting. Then run again with the generated topics.

/**
 * Generates a template for the documentation based on the codebase.
 * @param db - The database instance.
 * @param model - The language model instance.
 * @param abortSignal - The abort signal to cancel the operation.
 * @returns A promise that resolves when the template is applied.
 */
export async function applyGenerateTemplate(db: Database, model: LanguageModelV1, abortSignal: AbortSignal) {
	const codebase = await db.codebases.orderBy('createdAt').last();
	if (!codebase) return;

	const { elementStream } = streamObject({
		model,
		output: 'array',
		schema: chapterSchema,
		abortSignal: abortSignal,
		messages: [
			{ role: 'system', content: WriterGenerateStructure },
			{ role: 'user', content: codebase.prompt },
		],
		onError: (error) => {
			console.error('Error generating template:', error);
			throw new Error(`Error generating template: ${error}`);
		},
	});

	// Collect current chapters
	const oldChapters = await db.chapters.toArray();
	const oldChaptersIds = oldChapters.map((chapter) => chapter.id);

	// Create new chapters
	let counter = 0;
	for await (const object of elementStream) {
		if (abortSignal.aborted) break;

		await db.chapters.add({
			id: crypto.randomUUID() as string,
			index: counter++,
			title: object.title,
			outline: object.outline,
		});
	}

	// Remove all old chapters
	if (abortSignal.aborted) return;
	await db.chapters.bulkDelete(oldChaptersIds);
}
