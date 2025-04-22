import { z } from 'astro:schema';

export const promptifySchema = z.object({
	type: z.enum(['remote', 'files']),
	url: z.string().url('Please enter a valid repository URL').optional(),
	files: z.array(z.instanceof(File)).optional(),
	ignore: z.string().optional(),
	include: z.string().optional(),
	compress: z.boolean(),
});

export const testSchema = z.object({ test: z.boolean() })