import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig((config) => ({
  plugins: [
    solidPlugin(),
    config.command === 'build' && visualizer(),
    VitePWA({
      manifest: {
        background_color: '#111827',
        theme_color: '#111827',
        short_name: 'SRS',
        name: 'SRS',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
  ].filter(Boolean),
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
}))
