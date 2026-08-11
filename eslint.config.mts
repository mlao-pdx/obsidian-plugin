import obsidianmd from 'eslint-plugin-obsidianmd';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { globalIgnores, defineConfig } from 'eslint/config';
import tsdocSingleRemarks from './eslint-rules/tsdoc-single-remarks.ts';

export default defineConfig(
	globalIgnores([
		'node_modules',
		'dist',
		'coverage',
		'esbuild.config.mjs',
		'version-bump.mjs',
		'versions.json',
		'main.js',
		'package.json',
		'package-lock.json',
		'tsconfig.json',
		'scripts/promote-fast-check.mjs',
		'scripts/check-licenses.mjs',
	]),
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: [
						'eslint.config.mts',
						'manifest.json',
						'vitest.config.ts',
						'vitest.properties.config.ts',
					],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json'],
			},
		},
	},
	{
		files: ['tests/**/*.ts'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
	},
	...obsidianmd.configs.recommended,
	{
		files: ['**/*.ts'],
		plugins: {
			tsdoc,
			local: { rules: { 'tsdoc-single-remarks': tsdocSingleRemarks } },
		},
		rules: {
			'tsdoc/syntax': 'error',
			'local/tsdoc-single-remarks': 'error',
		},
	},
	{
		files: ['src/core/**/*.ts', 'src/ports/**/*.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: ['obsidian', 'obsidian/*'],
							message:
								'src/core and src/ports must not import obsidian at runtime — depend on a @ports/* interface instead.',
						},
						{
							group: ['dexie', 'dexie/*'],
							message:
								'src/core and src/ports must not import dexie at runtime — depend on a @ports/* interface instead.',
						},
					],
				},
			],
		},
	},
	prettier,
);
