import { defineConfig } from 'vite';
import htmlInject from 'vite-plugin-html-inject';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  plugins: [htmlInject()],
  build: {
    outDir: '../',
    emptyOutDir: false, // CRITICAL: Prevent Vite from deleting web-src and .git in the parent directory!
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        detail: resolve(__dirname, 'project-detail.html'),
      },
    },
  },
});
