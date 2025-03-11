import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    manifest: true,
    rollupOptions: {
      input: ['src/app.css', 'dist/app.js']
    },
  },
});
