// @ts-check
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	devToolbar: { enabled: false },
	vite: {
		plugins: [
			tailwindcss(),
			visualizer({
				gzipSize: true,
				brotliSize: true,
			}),
		],
		worker: {
			format: 'es',
		},
		optimizeDeps: {
			exclude: ['@electric-sql/pglite'],
		},
	},
});
