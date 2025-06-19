import { defaultIgnoreList } from 'node_modules/repomix/lib/config/defaultIgnore';
import { minimatch } from 'minimatch';

// List if ignored patters
export const ignorePatterns = [
	...new Set([
		...defaultIgnoreList,
		'**/node_modules/**',
		'**/vendor/**',
		'**/dist/**',
		'**/build/**',
		'**/out/**',
		'**/coverage/**',
		'**/vendor/**',
		'**/package-lock.json',
		'**/.env',
		'**/*.key',
		'**/*.pem',
		'**/*.p12',
		'**/*.pfx',
		'**/*.crt',
		'**/*.cer',
		'**/*.der',
		'**/id_rsa',
		'**/id_dsa',
		'**/id_ecdsa',
		'**/id_ed25519',
		'**/.ssh/**',
		'**/secrets/**',
		'**/config/secrets/**',
		'**/*.log',
		'**/passwords.txt',
		'**/password.txt',
	]),
];

// Files to include
export const codeFilesPatterns = [
	'**/.nvmrc',
	'**/.node-version',
	'**/.python-version',
	'**/*.env.dev*',
	'**/*.env.test*',
	'**/*.env.local*',
	'**/*.env.example*',
	'**/*.cpp',
	'**/*.h',
	'**/*.hpp',
	'**/*.c',
	'**/*.cc',
	'**/*.cs',
	'**/*.java',
	'**/*.js',
	'**/*.ts',
	'**/*.jsx',
	'**/*.tsx',
	'**/*.mjs',
	'**/*.cjs',
	'**/*.svelte',
	'**/*.vue',
	'**/*.astro',
	'**/*.cr',
	'**/*.rs',
	'**/*.rst',
	'**/*.go',
	'**/*.mod',
	'**/*.ex',
	'**/*.exs',
	'**/*.gleam',
	'**/*.glsl',
	'**/*.sql',
	'**/*.swift',
	'**/*.zig',
	'**/*.dart',
	'**/*.kt',
	'**/*.kts',
	'**/*.rb',
	'**/*.rake',
	'**/*.lua',
	'**/*.erb',
	'**/*.html',
	'**/*.css',
	'**/*.sass',
	'**/*.scss',
	'**/*.less',
	'**/*.json',
	'**/*.yaml',
	'**/*.yml',
	'**/*.xml',
	'**/*.md',
	'**/*.mdx',
	'**/*.txt',
	'**/*.csv',
	'**/*.php',
	'**/*.py',
	'**/*.pyi',
	'**/*.pyx',
	'**/*.ipynb',
	'**/*.ini',
	'**/*.toml',
	'**/*.sh',
	'**/*.bash',
	'**/*.ps1',
	'**/*.bat',
	'**/*.gitignore',
	'**/*.dockerfile',
	'**/*.dockerignore',
	'**/Dockerfile',
	'**/Makefile',
	'**/Gemfile',
	'**/pom.xml',
	'**/Procfile',
	'**/build.gradle',
	'**/package.json',
];

/**
 * Create a file filter function that filters files based on ignore and include patterns.
 * @param customIgnore - Custom ignore patterns as a comma-separated string.
 * @param customInclude - Custom include patterns as a comma-separated string.
 * @returns A function that filters files based on the provided patterns.
 */
export function createFileFilter(customIgnore: string[], customInclude: string[]): (file: File) => boolean {
	// const combinedIgnorePatterns = [...ignorePatterns, ...customIgnore];
	const ignoreRegExps = [...ignorePatterns, ...customIgnore]
		.map((pattern) => minimatch.makeRe(pattern))
		.filter(Boolean) as RegExp[];

	const includeRegExps = [...codeFilesPatterns, ...customInclude]
		.map((pattern) => minimatch.makeRe(pattern))
		.filter(Boolean) as RegExp[];

	return (file: File) => {
		const filePath = file.webkitRelativePath || file.name;

		// Since webkitRelativePath includes the root directory, we slice it off
		const relativePath = filePath.includes('/') ? filePath.substring(filePath.indexOf('/') + 1) : filePath;

		const isIgnored = ignoreRegExps.some((pattern) => pattern.test(relativePath));
		if (isIgnored) return false; // File is ignored

		const isIncluded = includeRegExps.some((pattern) => pattern.test(relativePath));
		if (!isIncluded) return false; // File is not included

		return true;
	};
}
