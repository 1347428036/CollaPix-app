import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig((mode) => {
  const env = loadEnv(mode.mode, process.cwd())
  return {
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
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path,
        },
        '/api/ws': {
          target: env.VITE_API_WS_BASE_URL,
          changeOrigin: true,
          // Enable WebSocket proxy
          ws: true,
        },
      },
    },
  }
})
