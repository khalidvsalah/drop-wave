import { defineConfig } from 'vite';

export default defineConfig({
  root: './test/documentation',
  server: { port: 1234, host: true },
  build: { outDir: './dist' },
});
