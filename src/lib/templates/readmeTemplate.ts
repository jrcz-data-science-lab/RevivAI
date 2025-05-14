import type { Database } from '@/hooks/useDb';

const outline = `
# PUT PROJECT TITLE HERE
A concise, beginner friendly introduction to what the project is about, its purpose, and the problems it aims to solve.

> NOTE: This documentation is generated using the RevivAI documentation generator.

## Features
A list of the main features of the project, including any unique selling points.

## Getting Started
Instructions on how to install and set-up the project.

## Usage
Instructions or examples on how to use the project.

## Project Structure
A description of each project directory, including a clear explanation of their contents.

## Contributing
Instructions for contributing to the project.

## License
The license under which the project is distributed.
`;

/**
 * Applies a README template to the database.
 * @param db - The database instance.
 * @returns A promise that resolves when the template is applied.
 */
export async function applyReadmeTemplate(db: Database) {
	await db.chapters.clear();

	await db.chapters.add({
		id: crypto.randomUUID() as string,
		index: 0,
		title: 'README',
		outline: outline.trim(),
	});
}
