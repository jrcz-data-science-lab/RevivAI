import { intro, outro, confirm, log, isCancel } from '@clack/prompts';
import { join } from '@std/path';
import { generateEmbeddings, testOllamaConnection } from '../cli/utils.ts';
import { ensureDir } from '@std/fs';
import process from "node:process";

interface FileManifest {
    name: string;
    path: string;
    hash: string;
    mtime: number;
    description: string;
    tokensCount: number;
}

function exitIfCanceled(value: unknown, message?: string) {
    if (isCancel(value)) {
        log.info(message ?? 'Operation cancelled.');
        process.exit(0);
    }
}

export async function initProject() {
		intro('Lets start initializing you RevivAI project!');

		const currentDir = Deno.cwd();
		const revivaiDir = join(currentDir, '.revivai');

		const ollamaAvailable = await testOllamaConnection();
		if (ollamaAvailable) {
			const x = await generateEmbeddings('Hello, world!');
			console.log(x);

			log.success('Local Ollama instance was found! 🦙');
		} else {
			log.info('Ollama connection not found');
		}

		const useOllama = await confirm({
			message: 'Do you want to use local Ollama instance?',
			initialValue: true,
		});

        exitIfCanceled(useOllama);

		const createFolder = await confirm({
			message: 'Do you want to create .revivai folder?',
			initialValue: true,
		});

        exitIfCanceled(useOllama);

		if (createFolder) await ensureDir(revivaiDir);


		outro('RevivAI initialized successfully!');


}