// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
	adapter: node({
		mode: 'standalone',
	}),
	security: {
		checkOrigin: false,
	},
	devToolbar: {
		enabled: false,
	},
	integrations: [
		react({
			babel: {
				// Enable React Compiler
				plugins: ['babel-plugin-react-compiler'],
			},
		}),
	],
	vite: {
		plugins: [tailwindcss(), visualizer()],
		build: {
			cssCodeSplit: true,
			chunkSizeWarningLimit: 5000,
		},
		worker: {
			format: 'es',
		},
		server: {
			cors: true,
			watch: {
				ignored: ['**/_temp/**'],
			},
		},
	},
});
