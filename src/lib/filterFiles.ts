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
export const includePatterns = [
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

// Precalculate the matchers for ignore and include patterns
const ignorePatternsMatchers = ignorePatterns.map((pattern) => minimatch.filter(pattern, { dot: true }));
const includePatternsMatchers = includePatterns.map((pattern) => minimatch.filter(pattern));

/**
 * Check if the path is ignored
 * @param path - The path to check.
 * @param customIgnorePatterns - Custom ignore patterns
 * @returns True if the path is ignored, false otherwise.
 */
export function isPathIgnored(path: string, customIgnorePatterns?: string) {
	// Match default ignore patterns first
	for (const matcher of ignorePatternsMatchers) {
		if (matcher(path)) return true;
	}

	// If custom ignore patterns are provided, match them as well
	if (customIgnorePatterns) {
		const customPatterns = customIgnorePatterns.split(',').map(p => p.trim());
		const customMatchers = customPatterns.map(pattern => minimatch.filter(pattern, { dot: true }));

		for (const customMatcher of customMatchers) {
			if (customMatcher(path)) return true;
		}
	}

	return false;
}

/**
 * Check if the path is included
 * @param path - The path to check.
 * @param customIncludePatterns - Custom include patterns
 * @returns True if the path is included, false otherwise.
 */
export function isPathIncluded(path: string, customIncludePatterns?: string) {
	// Match default include patterns first
	for (const matcher of includePatternsMatchers) {
		if (matcher(path)) return true;
	}

	if (customIncludePatterns) {
		const customPatterns = customIncludePatterns.split(',').map((p) => p.trim());
		const customMatchers = customPatterns.map((pattern) => minimatch.filter(pattern, { dot: true }));
		
		for (const customMatcher of customMatchers) {
			if (customMatcher(path)) return true;
		}
	}

	return false;
}
