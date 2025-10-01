import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
// Generate version string based on current timestamp
const VERSION = new Date().toISOString();

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.svg'],
      manifest: {
        name: 'Formshive - Online Form Builder | Create Custom Forms',
        short_name: 'Formshive',
        description: 'Create custom forms in minutes. Registration forms, application forms, surveys, contact forms and more.',
        theme_color: '#228be6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ],
        categories: ['productivity', 'utilities', 'business'],
        shortcuts: [
          {
            name: 'Create Form',
            short_name: 'New Form',
            description: 'Create a new form',
            url: '/forms/new',
            icons: [
              {
                src: '/icon-192.png',
                sizes: '192x192'
              }
            ]
          },
          {
            name: 'View Forms',
            short_name: 'My Forms',
            description: 'View your forms',
            url: '/forms',
            icons: [
              {
                src: '/icon-192.png',
                sizes: '192x192'
              }
            ]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        cacheId: `formshive-${VERSION}`,
        additionalManifestEntries: [
          {
            url: '/app-version',
            revision: VERSION
          }
        ],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: `images-cache-${VERSION.slice(0, 10)}`,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true
      }
    }),
    sentryVitePlugin({
      telemetry: false,
      url: process.env.SENTRY_BASE_URL,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT || 'formshive',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: './dist/**',
      },
    }),
  ],
  worker: {
    format: 'es',
    plugins: () => [],
  },
  build: {
    commonjsOptions: {
      include: [/@rusty\/common/, /node_modules/],
    },
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ['@gofranz/common'],
  },
});
