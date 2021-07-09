import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    minify: 'esbuild',
  },
  resolve: {
    alias: [
      { find: '@src', replacement: '/src' },
      { find: '@utils', replacement: '/utils' },
    ],
  },
});
