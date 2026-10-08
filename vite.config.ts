import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png', 'assets/logo.svg', 'apple-touch-icon.png', 'og-image.jpg'],
      manifest: {
        name: 'שלוף - פק"ל חידות והפעלות שטח',
        short_name: 'שלוף',
        description: 'אפליקציית חידות, משחקים והפעלות שטח למדריכים ללא צורך באינטרנט',
        theme_color: '#d97706',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        dir: 'rtl',
        lang: 'he',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,jpg}'],
        dontCacheBustURLsMatching: /-[a-zA-Z0-9_-]{8}\./,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        ignoreURLParametersMatching: [/.*/]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
          }
          if (id.includes('encrypted-data.json') || id.includes('src/data/content.ts') || id.includes('src\\data\\content.ts')) {
            return 'content-data';
          }
        }
      }
    }
  }
});

