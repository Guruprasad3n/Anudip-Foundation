// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa';

// export default defineConfig({
//   plugins: [
//     react(),
//     VitePWA({
//       registerType: 'autoUpdate',
//       includeAssets: ['Anudip-Logo.png', 'offline.html'],
//       manifest: {
//         name: 'PEARL Dashboard',
//         short_name: 'PEARL',
//         start_url: '/',
//         display: 'standalone',
//         background_color: '#ffffff',
//         theme_color: '#007bff',
//         icons: [
//           {
//             src: 'Anudip-Logo.png',
//             sizes: '192x192',
//             type: 'image/png',
//           },
//         ],
//       },
//       workbox: {
//         // ✅ CHANGE THIS LINE
//         navigateFallback: '/index.html',

//         // ✅ Optional: Only show offline.html for specific requests like assets
//         // Leave runtimeCaching if needed
//         runtimeCaching: [
//           {
//             urlPattern: /^https:\/\/[^/]+/,
//             handler: 'NetworkFirst',
//             options: {
//               cacheName: 'external-resources',
//               networkTimeoutSeconds: 3,
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 86400,
//               },
//               cacheableResponse: {
//                 statuses: [0, 200],
//               },
//             },
//           },
//         ],
//       },
//     }),
//   ],
//   define: {
//     __API_URL__: JSON.stringify('https://anaudip-foundation.onrender.com'),
//   },
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
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
        navigateFallback: '/index.html',
        // ✅ Catch handler for offline mode
        navigateFallbackAllowlist: [/^\/$/], // Allow / to fallback
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
        // ✅ Define the catch handler
        cleanupOutdatedCaches: true,
        sourcemap: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // This will instruct the service worker to show offline.html on network failure
        navigateFallback: '/index.html',
        // Add fallback for requests
        globIgnores: ['**/node_modules/**/*'],
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  define: {
    __API_URL__: JSON.stringify('https://anaudip-foundation.onrender.com')
  }
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa';
// export default defineConfig({
//   plugins: [react(),
//   VitePWA({
//     registerType: 'autoUpdate',
//     includeAssets: ['Anudip-Logo.png', 'offline.html'],
//     manifest: {
//       name: 'PEARL Dashboard',
//       short_name: 'PEARL',
//       start_url: '/',
//       display: 'standalone',
//       background_color: '#ffffff',
//       theme_color: '#007bff',
//       icons: [
//         {
//           src: 'Anudip-Logo.png',
//           sizes: '192x192',
//           type: 'image/png'
//         }
//       ]
//     },
//     workbox: {
//       navigateFallback: '/offline.html',
//       runtimeCaching: [
//         {
//           urlPattern: /^https:\/\/[^/]+/,
//           handler: 'NetworkFirst',
//           options: {
//             cacheName: 'external-resources',
//             networkTimeoutSeconds: 3,
//             expiration: {
//               maxEntries: 50,
//               maxAgeSeconds: 86400
//             },
//             cacheableResponse: {
//               statuses: [0, 200]
//             }
//           }
//         }
//       ]
//     }
//   })],
//   define: {
//     __API_URL__: JSON.stringify('https://anaudip-foundation.onrender.com')
//   }
// })

// __API_URL__: JSON.stringify(
//   process.env.NODE_ENV === 'production'
//     ? 'https://anaudip-foundation.onrender.com/'
//     : 'http://localhost:3000'
// )