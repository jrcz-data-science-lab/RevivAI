// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';


// https://astro.build/config
export default defineConfig({
	integrations: [
		react({
			babel: {
        		// Enable React Compiler
				// plugins: ['babel-plugin-react-compiler'],
			},
		}),
	],
	devToolbar: { enabled: false },
	vite: {
		plugins: [tailwindcss(), visualizer()],
		worker: {
			format: 'es',
		},
		server: {
			cors: true,
		},
	},
	adapter: node({
		mode: 'standalone',
	}),
});