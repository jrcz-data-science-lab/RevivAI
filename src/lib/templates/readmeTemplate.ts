import type { Database } from '@/hooks/useDb';

const description = `
# README
## Project Title
A brief description of your project.
## Installation
Instructions on how to install and set up the project.
## Usage
Instructions on how to use the project.
## Contributing
Instructions for contributing to the project.
## License
The license under which the project is distributed.
`;


export async function applyReadmeTemplate(db: Database) {
	await db.chapters.clear();

    await db.chapters.add({
        id: crypto.randomUUID() as string,
        index: 0,
        title: 'README',
        description: description,
        content: '',
    });
}
