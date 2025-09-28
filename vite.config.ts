import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import chakratsconfigPaths from "vite-tsconfig-paths"
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
    chakratsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png'],
      manifest: {
        name: 'ShoeBill AI',
        short_name: 'ShoeBill AI',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'app-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }  
         ]
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: /^\/api\/(quiz|quizzes).*/,
          handler: "CacheFirst" as const,
          options: {
            cacheName: "api-cache",
            cacheableResponse:{
              statuses: [0, 200]
            }
          }
        }]
      }
    })
  ],
})