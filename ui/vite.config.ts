import { defineConfig } from 'vite';
import react from 'npm:@vitejs/plugin-react';
import tailwindcss from 'npm:@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
});
