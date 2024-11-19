import { defineConfig } from 'vite';

export default defineConfig({
  root: '__test__/browser',
  server: { port: 1234, host: true },
  build: { outDir: './dist' },
});
