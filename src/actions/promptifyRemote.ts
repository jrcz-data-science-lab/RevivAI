import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import path from 'node:path';
import { runCli } from 'repomix';
import { mkdir, rm, readFile } from 'node:fs/promises';

const workingDir = process.cwd();

export const promptifyRemoteSchema = z.object({
	url: z.string().url('Please enter a valid repository URL'),
	compress: z.boolean().default(false).optional(),
	ignore: z.string().default('').optional(),
});

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

			if (!result) return { success: false, error: 'No output from RepoMix' };

			const fileContent = await readFile(outputFile, 'utf-8');

			return {
				success: true,
				prompt: fileContent,
				metadata: result.packResult,
				message: `Successfully processed repository "${url}"`,
			};
		} catch (error) {
			console.error('Error processing repository:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		} finally {
			rm(tempDir, { recursive: true, force: true });
		}
	},
});
