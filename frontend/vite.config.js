import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3006,
    strictPort: false,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:3005',
        changeOrigin: true,
        rewrite: (path) => path,
        ws: true
      }
    }
  }
})
