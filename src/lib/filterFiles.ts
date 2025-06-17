import { defaultIgnoreList } from 'node_modules/repomix/lib/config/defaultIgnore';
import { minimatch } from 'minimatch';

// List if ignored patters
export const ignorePatterns = [
	...defaultIgnoreList,
	'**/node_modules/**',
	'**/vendor/**',
	'**/dist/**',
	'**/build/**',
	'**/out/**',
	'**/coverage/**',
	'**/vendor/**',
	'**/package-lock.json',
];

// Files to include
export const includePatterns = [
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
	'**/*.rs',
	'**/*.rst',
	'**/*.go',
	'**/*.sql',
	'**/*.swift',
	'**/*.rb',
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
	'**/build.gradle',
	'**/package.json',
];

/**
 * Check if the path is ignored
 * @param path - The path to check.
 * @param customIgnorePatterns - Custom ignore patterns
 * @returns True if the path is ignored, false otherwise.
 */
export function isPathIgnored(path: string, customIgnorePatterns?: string) {
	if (customIgnorePatterns) {
		const customPatterns = customIgnorePatterns.split(',').map((pattern) => pattern.trim());
		return [...ignorePatterns, ...customPatterns].some((pattern) => minimatch(path, pattern));
	}

	return ignorePatterns.some((pattern) => minimatch(path, pattern));
}

/**
 * Check if the path is included
 * @param path - The path to check.
 * @param customIncludePatterns - Custom include patterns
 * @returns True if the path is included, false otherwise.
 */
export function isPathIncluded(path: string, customIncludePatterns?: string) {
	if (customIncludePatterns) {
		const customPatterns = customIncludePatterns.split(',').map((pattern) => pattern.trim());
		return [...includePatterns, ...customPatterns].some((pattern) => minimatch(path, pattern));
	}

	return includePatterns.some((pattern) => minimatch(path, pattern));
}
