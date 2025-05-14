import { ActionError, defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import path from 'node:path';
import { runCli } from 'repomix';
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import type { PackResult } from 'node_modules/repomix/lib/core/packager';
import { promptifySchema } from '@/lib/schemas';

const WORKING_DIR = process.cwd();

export interface PromptifyResult {
	prompt: string;
	metadata: PackResult;
}

/**
 * Save files to a temporary directory and return their paths.
 * @param files - Array of File objects to save.
 * @param tempDir - Path to the temporary directory.
 * @returns Array of saved file paths.
 */
function saveFilesToTempDir(files: File[], tempDir: string) {
	// Throw error on too much files
	const totalSize = files.reduce((acc, file) => acc + file.size, 0);
	if (totalSize > 100_000_000) throw new Error('Uploaded codebase is bigger then 100mb. Use include/ignore patterns to reduce the size.');

	return Promise.all(
		files.map(async (file) => {
			const filePath = path.join(tempDir, file.name);

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
}

/**
 * Run the RepoMix CLI to promptify local files.
 * @param dirPath - Path to the directory containing files.
 * @param outputFile - Path to the output file.
 * @param compress - Whether to compress the output.
 * @param ignore - Files or directories to ignore.
 * @param include - Files or directories to include.
 * @returns The generated prompt and metadata.
 */
async function runRepomixForDirectory(
	dirPath: string,
	outputFile: string,
	compress: boolean,
	ignore: string,
	include: string,
) {
	const result = await runCli([dirPath], WORKING_DIR, {
		style: 'markdown',
		quiet: true,
		compress: compress,
		output: outputFile,
		removeEmptyLines: true,
		ignore: ignore,
		include: include,
	});

	if (!result) throw new Error('No output from RepoMix');
	const fileContent = await readFile(outputFile, 'utf-8');

	return {
		prompt: fileContent,
		metadata: result.packResult,
	} as PromptifyResult;
}

/**
 * Run the RepoMix CLI to promptify a remote repository.
 * @param dir - Path to the directory for temporary files.
 * @param url - URL of the remote repository.
 * @param compress - Whether to compress the output.
 * @param ignore - Files or directories to ignore.
 * @param include - Files or directories to include.
 * @returns The generated prompt and metadata.
 */
async function runRepomixForRemote(
	outputFile: string,
	url: string,
	compress: boolean,
	ignore: string,
	include: string,
) {
	const result = await runCli([], WORKING_DIR, {
		style: 'markdown',
		quiet: true,
		remote: url,
		compress: compress,
		output: outputFile,
		removeEmptyLines: true,
		ignore: ignore,
		include: include,
	});

	if (!result) throw new Error('No output from RepoMix');
	const fileContent = await readFile(outputFile, 'utf-8');

	return {
		prompt: fileContent,
		metadata: result.packResult,
	} as PromptifyResult;
}

/**
 * This action accepts a form submission with code files or Github URL,
 * processes code using RepoMix CLI, and returns the generated prompt.
 */
export const promptify = defineAction({
	accept: 'form',
	input: promptifySchema,
	handler: async ({ type, files, url, compress, ignore, include }) => {
		const submissionID = crypto.randomUUID();
		const tempDir = path.join(WORKING_DIR, '_temp', submissionID);

		// Ensure if the type is 'remote', a URL is provided
		if (type === 'remote' && !url) {
			throw new ActionError({ code: 'BAD_REQUEST', message: 'No URL provided' });
		}

		// Ensure if the type is 'files', files are provided
		if (type === 'files' && !files) {
			throw new ActionError({ code: 'BAD_REQUEST', message: 'No files provided' });
		}

		try {
			// Create a temporary directory for this submission
			await mkdir(tempDir, { recursive: true });

			// Run RepoMix for remote repository
			if (type === 'remote') {
				const outputFile = path.join(tempDir, `prompt-${submissionID}.md`);
				return await runRepomixForRemote(outputFile, url as string, compress, ignore ?? '', include ?? '');
			}

			// Create a unique temporary directory for this submission
			let savedFilePaths = await saveFilesToTempDir(files as File[], tempDir);
			savedFilePaths = savedFilePaths.filter((filePath) => filePath !== null);

			// Run RepoMix for local files
			const outputFile = path.join(tempDir, `prompt-${submissionID}.md`);
			return await runRepomixForDirectory(tempDir, outputFile, compress, ignore ?? '', include ?? '');
		} catch (error) {
			throw new ActionError({
				code: 'BAD_REQUEST',
				message: (error as Error)?.message ?? 'Error processing files',
			});
		} finally {
			rm(tempDir, { recursive: true, force: true });
		}
	},
});
