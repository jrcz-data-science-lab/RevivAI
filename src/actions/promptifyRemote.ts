import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import path from 'node:path';
import { runCli } from 'repomix';
import { mkdir, rm, readFile } from 'node:fs/promises';
import type { PackResult } from 'node_modules/repomix/lib/core/packager';

const workingDir = process.cwd();

export const promptifyRemoteSchema = z.object({
	url: z.string().url('Please enter a valid repository URL'),
	compress: z.boolean().default(false).optional(),
	ignore: z.string().default('').optional(),
});

export interface PromptifyFilesResult {
	prompt: string;
	metadata: PackResult;
}

/**
 * This action accepts a
 */
export const promptifyRemote = defineAction({
	input: promptifyRemoteSchema,
	handler: async ({ url, compress, ignore }) => {
		const submissionID = crypto.randomUUID();

		const tempDir = path.join(workingDir, '_temp', submissionID);
		const outputFile = path.join(tempDir, `${submissionID}.md`);

		try {
			// Create temporary directory
			await mkdir(tempDir, { recursive: true });

			const result = await runCli([tempDir], workingDir, {
				quiet: true,
				style: 'markdown',
				remote: url,
				compress: compress,
				output: outputFile,
				removeEmptyLines: true,
				ignore: ignore,
			});

			if (!result) throw new Error('No output from RepoMix');

			const fileContent = await readFile(outputFile, 'utf-8');

			return {
				prompt: fileContent,
				metadata: result.packResult,
			} as PromptifyFilesResult;
		} catch (error) {
			console.error('Error processing repository:', error);
			throw new ActionError({
				code: 'BAD_REQUEST',
				message: (error as Error)?.message ?? 'Error processing repository',
			});
		} finally {
			rm(tempDir, { recursive: true, force: true });
		}
	},
});

// Re-export combined promptify actions
export * from './promptifyFiles';
