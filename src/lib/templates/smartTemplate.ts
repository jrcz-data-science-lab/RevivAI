import type { Database } from '@/hooks/useDb';
import { generateText, streamObject, type LanguageModelV1 } from 'ai';
import { chapterSchema } from '../schemas';
import WriterGenerateStructure from '@/lib/prompts/writer-generate.md?raw';
import type { Settings } from '@/hooks/useSettings';
import { getLanguagePrompt } from '../languages';

/**
 * Generates a template for the documentation based on the codebase.
 * @param db - The database instance.
 * @param model - The language model instance.
 * @param abortSignal - The abort signal to cancel the operation.
 * @returns A promise that resolves when the template is applied.
 */
export async function applySmartTemplate(
	db: Database,
	model: LanguageModelV1,
	settings: Settings,
	abortSignal: AbortSignal,
) {
	const codebase = await db.codebases.orderBy('createdAt').last();
	if (!codebase) return;

	const { elementStream } = streamObject({
		model,
		output: 'array',
		schema: chapterSchema,
		abortSignal: abortSignal,
		temperature: settings.temperature,
		messages: [
			{ role: 'system', content: WriterGenerateStructure },
			{ role: 'user', content: getLanguagePrompt(settings.language) },
			{ role: 'user', content: codebase.prompt },
		],
		onError: (error) => {
			console.error('Error generating template:', error);
			throw new Error(`Error generating template: ${error}`);
		},
	});

	// Delete all old chapters
	await db.chapters.clear();

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
}
