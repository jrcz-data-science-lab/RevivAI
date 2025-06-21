import { z } from 'astro:schema';

// Promptify schema
export const promptifySchema = z.object({
	type: z.enum(['remote', 'files']),
	url: z.string().url('Please enter a valid repository URL').optional(),
	files: z.array(z.instanceof(File)).optional(),
	ignore: z.string().optional(),
	include: z.string().optional(),
	compress: z.boolean(),
});

// Test schema for LLM structured output testing
export const testSchema = z.object({ test: z.boolean() });

// Schema for form validation
export const newProjectFormSchema = z.object({
	projectName: z
		.string()
		.trim()
		.min(2, {
			message: 'Project name must be at least 2 characters.',
		})
		.max(30, {
			message: 'Project name must be at most 30 characters.',
		}),
});

// Chapter LLM request schema
export const chapterSchema = z.object({
	title: z.string().max(50).describe('Chapter title.'),
	outline: z.string().max(1500).describe('Chapter structure with headings, sub-headings and their descriptions.'),
});
