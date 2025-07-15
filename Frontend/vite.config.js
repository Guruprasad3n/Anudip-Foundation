import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['offline.html', 'Anudip-Logo.png'],
      manifest: {
        name: 'PEARL Dashboard',
        short_name: 'PEARL',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#007bff',
        icons: [
          {
            src: 'Anudip-Logo.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      strategies: 'generateSW', // ✅ Use generateSW instead of injectManifest
      workbox: {
        navigateFallback: '/index.html', // ✅ Fix refresh issue
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/[^/]+/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'external-resources',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      }
    })

  ],
  define: {
    // __API_URL__: JSON.stringify('https://anaudip-foundation.onrender.com'),
    __API_URL__: JSON.stringify('http://localhost:3000'),
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,         // ✅ Prevents .mjs issue
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
});

// __API_URL__: JSON.stringify(
//   process.env.NODE_ENV === 'production'
//     ? 'https://anaudip-foundation.onrender.com/'
//     : 'http://localhost:3000'
// )