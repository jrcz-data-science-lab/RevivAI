import ora from 'ora';
import chalk from 'chalk';
import process from 'node:process';
import { ensureDir } from '@std/fs';
import { join } from '@std/path';
import { intro, outro, confirm, log } from '@clack/prompts';
import { Command } from 'commander';
import { startServer } from './server.ts';
import config from './deno.json' with { type: 'json' };
import { generateEmbeddings, testOllamaConnection } from './utils.ts';

// Modify color mode based on Deno.noColor
process.env[Deno.noColor ? 'NO_COLOR' : 'FORCE_COLOR'] = 'true';

const cli = new Command('revivai')
	.description('RevivAI - AI powered tool for generating documentation from code.')
	.version(config.version, '-v, --version', 'output the current version of CLI');

// Style help output
cli.configureHelp({
	styleTitle: (str) => chalk.bold(str),
	styleCommandText: (str) => chalk.white(str),
	styleCommandDescription: (str) => chalk.gray(chalk.italic(str)),
	styleDescriptionText: (str) => chalk.gray(chalk.italic(str)),
	styleOptionText: (str) => chalk.green(str),
	styleArgumentText: (str) => chalk.cyan(str),
	styleSubcommandText: (str) => chalk.cyan(str),
});

// Serve command - starts HTTP server
cli.command('serve')
	.description('start HTTP server')
	.option('-p, --port <port:number>', 'Port to listen on', '3000')
	.action(({ port }: { port: number }) => {
		// const spinner = ora('Starting HTTP server...').start();

		try {
			startServer(port);
			// spinner.succeed(`HTTP server started on http://localhost:${port}`);
		} catch (error: any) {
			log.error(`Failed to start server: ${error?.message}`);
			// spinner.fail(`Failed to start server: ${error?.message}`);
			Deno.exit(1);
		}
	});

cli.command('init')
	.description('Initialize RevivAI in the current directory')
	.action(async () => {
		intro('Lets start initializing you RevivAI project!');

		const x = await generateEmbeddings('Hello, world!');
		console.log(x);

		const currentDir = Deno.cwd();
		const revivaiDir = join(currentDir, '.revivai');

		const ollamaAvailable = await testOllamaConnection();
		if (ollamaAvailable) {
			log.success('Local Ollama instance was found! 🦙');
		} else {
			log.info('Ollama connection not found');
		}

		const useOllama = await confirm({
			message: 'Do you want to use local Ollama instance?',
			initialValue: true,
		});


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
