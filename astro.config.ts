// @ts-check
import { defineConfig } from 'astro/config';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@astrojs/react';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false },

  vite: {
      plugins: [
          tailwindcss(),
          visualizer(),
      ],
      worker: {
          format: 'es',
      }
	},

  adapter: node({
    mode: 'standalone',
  }),
});