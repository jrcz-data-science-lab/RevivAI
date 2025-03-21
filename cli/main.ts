
import process from 'node:process';
import * as color from '@std/fmt/colors';
import { ensureDir, walk } from '@std/fs';
import { join } from '@std/path';
import { intro, outro, confirm, log, isCancel, cancel } from '@clack/prompts';
import { Command } from 'commander';
import { startServer } from './server.ts';
import { generateEmbeddings, testOllamaConnection } from './utils.ts';
import config from '../deno.json' with { type: 'json' };

// Modify color mode based on Deno.noColor
process.env[Deno.noColor ? 'NO_COLOR' : 'FORCE_COLOR'] = 'true';

const cli = new Command('revivai')
	.description('RevivAI - AI powered tool for generating documentation from code.')
	.version(config.version, '-v, --version', 'output the current version of CLI');

// Style help output
cli.configureHelp({
	styleTitle: (str) => color.bold(str),
	styleCommandText: (str) => color.white(str),
	styleCommandDescription: (str) => color.gray(color.italic(str)),
	styleDescriptionText: (str) => color.gray(color.italic(str)),
	styleOptionText: (str) => color.green(str),
	styleArgumentText: (str) => color.cyan(str),
	styleSubcommandText: (str) => color.cyan(str),
});

// Serve command - starts HTTP server
cli.command('serve')
	.description('start HTTP server')
	.option('-o, --open', 'open browser on server start')
	.option('-p, --port <port:number>', 'port to start server on. Default is 3000.')
	.action(({ port }: { port: number | undefined }) => {
		startServer(port);
	});

cli.command('init')
	.description('Initialize RevivAI in the current directory')
	.action(async () => {
		intro('Lets start initializing you RevivAI project!');

		const currentDir = Deno.cwd();
		const revivaiDir = join(currentDir, '.revivai');

		// list all files in the current directory
		const files = Deno.readDirSync(currentDir);
		for (const file of files) {
			const fsFile = await Deno.open(file.name);
			const fsStat = await fsFile.stat();
		}

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

		if (isCancel(useOllama)) {
			cancel('Operation cancelled.');
			process.exit(0);
		}


		const createFolder = await confirm({
			message: 'Do you want to create .revivai folder?',
			initialValue: true,
		});

		if (createFolder) await ensureDir(revivaiDir);


		outro('RevivAI initialized successfully!');
	});

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	cli.parse(Deno.args, { from: 'user' });
}
