import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://192.168.31.26:8123',
        changeOrigin: true,
        rewrite: (path) => path, //.replace(/^\/api/, ''),
      },
      '/api/ws': {
        target: 'ws://192.168.31.26:8123',
        changeOrigin: true,
        // Enable WebSocket proxy
        ws: true,
      },
    },
  },
})
