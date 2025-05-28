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
		plugins: [
			tailwindcss(), 
			visualizer()
		],
		build: {
			rollupOptions: {
				output: {
					manualChunks: {
						// Separate vendor chunks for better caching
						'vendor-react': ['react', 'react-dom'],
						'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-scroll-area', '@radix-ui/react-progress'],
						'vendor-mdx': ['@mdxeditor/editor'],
						'vendor-ai': ['@ai-sdk/openai', '@ai-sdk/anthropic', '@ai-sdk/google'],
						'vendor-utils': ['date-fns', 'clsx', 'tailwind-merge'],
						'vendor-markdown': ['react-markdown', 'remark-gfm', 'react-shiki'],
						'vendor-animation': ['motion', 'react-medium-image-zoom'],
						'vendor-onboarding': ['react-joyride'],
						'vendor-charts': ['mermaid'],
						'vendor-forms': ['react-hook-form', '@hookform/resolvers'],
					},
				},
			},
			// CSS optimization
			cssCodeSplit: true,
			// Reduce chunk size for better loading
			chunkSizeWarningLimit: 1000,
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
