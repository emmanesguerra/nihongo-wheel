import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/nihongo-wheel/', // <-- GitHub repository name

  plugins: [
    vue(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png'
      ],

      manifest: {
        name: 'Vocabulary Wheel',
        short_name: 'VocabWheel',
        description: 'Japanese Vocabulary Wheel Game 1',
        theme_color: '#343a40',
        background_color: '#ffffff',
        display: 'standalone',

        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})