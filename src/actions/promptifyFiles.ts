import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import path from 'node:path';
import { runCli } from 'repomix';
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';

const workingDir = process.cwd();

export const promptifyFilesSchema = z.object({
	files: z.array(z.instanceof(File)),
	compress: z.boolean().default(false).optional(),
	ignore: z.string().default('').optional(),
});

/**
 * This action accepts a form submission with files and options,
 * processes the files using RepoMix CLI, and returns the generated prompt.
 */
export const promptifyFiles = defineAction({
	accept: 'form',
	input: promptifyFilesSchema,
	handler: async ({ files, compress, ignore }) => {
		console.log('Received files:', files);

		const submissionID = crypto.randomUUID();

		const tempDir = path.join(workingDir, '_temp', submissionID);
		const outputFile = path.join(tempDir, `${submissionID}.md`);

		try {
			// Create temporary directory
			await mkdir(tempDir, { recursive: true });

			// Save files to the temporary directory
			let savedFilePaths = await Promise.all(
				files.map(async (file, index) => {
					const filePath = path.join(tempDir, file.name);

					if (filePath.includes('node_modules/')) return null;

					// Verify the path is still within our temp directory (prevent path traversal)
					if (!filePath.startsWith(tempDir)) {
						throw new Error(`Invalid file path detected: ${file.name}`);
					}

					// Handle subdirectories in the file name if needed
					const fileDir = path.dirname(filePath);
					if (fileDir !== tempDir) await mkdir(fileDir, { recursive: true });

					const arrayBuffer = await file.arrayBuffer();
					const buffer = Buffer.from(arrayBuffer);

					await writeFile(filePath, buffer);
					return filePath;
				}),
			);

			savedFilePaths = savedFilePaths.filter((filePath) => filePath !== null);

			const result = await runCli([tempDir], workingDir, {
				quiet: true,
				compress: compress,
				output: outputFile,
				ignore: ignore,
				style: 'markdown',
				removeEmptyLines: true,
			});

			if (!result) return { success: false, error: 'No output from RepoMix' };

			const fileContent = await readFile(outputFile, 'utf-8');

			return {
				success: true,
				prompt: fileContent,
				metadata: result.packResult,
				message: `Successfully processed ${savedFilePaths.length} files`,
			};
		} catch (error) {
			console.error('Error processing files:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		} finally {
			rm(tempDir, { recursive: true, force: true });
		}
	},
});
