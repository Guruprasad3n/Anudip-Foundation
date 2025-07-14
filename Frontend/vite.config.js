import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['Anudip-Logo.png', 'offline.html'],
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
    workbox: {
      navigateFallback: '/offline.html',
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/[^/]+/, // Cache API or font requests
          handler: 'NetworkFirst',
          options: {
            cacheName: 'external-resources',
            networkTimeoutSeconds: 3,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 86400
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  })],
  define: {
    __API_URL__: JSON.stringify('https://anaudip-foundation.onrender.com')
  }
})

// __API_URL__: JSON.stringify(
//   process.env.NODE_ENV === 'production'
//     ? 'https://anaudip-foundation.onrender.com/'
//     : 'http://localhost:3000'
// )