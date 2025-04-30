import type { Database } from '@/hooks/useDb';
import { streamObject, type LanguageModelV1 } from 'ai';
import { chapterSchema } from '../schemas';
import WriterGenerateStructure from '@/lib/prompts/writer-generate-structure.md?raw';

export async function applyGenerateTemplate(db: Database, model: LanguageModelV1) {
	const codebase = await db.codebases.orderBy('createdAt').last();
	if (!codebase) return;

	const { elementStream } = streamObject({
		model,
		output: 'array',
		schema: chapterSchema,
		messages: [
			{ role: 'system', content: WriterGenerateStructure },
			{ role: 'system', content: codebase.prompt },
			{
				role: 'user',
				content:
					'Analyze this codebase, and provide list of possible documentation chapters for this repository. No more than 10 chapters.',
			},
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
		console.log('Generated object:', object);
		await db.chapters.add({
			id: crypto.randomUUID() as string,
			index: counter++,
			title: object.title,
			description: object.content,
			content: '',
		});
	}

	// Remove all old chapters
	await db.chapters.bulkDelete(oldChaptersIds);
}
