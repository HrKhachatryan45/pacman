import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/auth': {
          target: env.VITE_BACKEND_HOST_URL,
          changeOrigin: true,
          secure: false,
        },
        '/requests': {
          target: env.VITE_BACKEND_HOST_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
