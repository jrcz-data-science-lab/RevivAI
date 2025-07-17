import type { Codebase } from '@/hooks/useCodebase';
import type { Database } from '@/hooks/useDb';
import type { Settings } from '@/hooks/useSettings';
import WriterGenerateStructure from '@/lib/prompts/writer-generate.md?raw';
import { type LanguageModelV1, generateText, streamObject } from 'ai';
import { getLanguagePrompt } from '../languages';
import { chapterSchema } from '../schemas';

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
	codebase: Codebase,
	settings: Settings,
	abortSignal: AbortSignal,
) {
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
