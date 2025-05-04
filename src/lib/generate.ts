import type { Chapter } from '@/hooks/useDb';
import { generateObject, generateText, type LanguageModelV1 } from 'ai';
import WriterPrompt from '@/lib/prompts/writer.md?raw';

export function createTOCPrompt(chapters: Chapter[]) {
	const toc = chapters.map((chapter) => `./${chapter.title.trim()}.md`).join('\n');

	return `# Table of Contents\n\n${toc}`;
}

export async function documentChapter(codebasePrompt: string, chapter: Chapter, model: LanguageModelV1, tableOfContents: string) {
	const { text } = await generateText({
		model,
		messages: [
			{ role: 'system', content: WriterPrompt },
			{ role: 'system', content: codebasePrompt },
			{ role: 'system', content: tableOfContents },
			{ role: 'user', content: chapter.outline },
		],
	});

    return text;
}
