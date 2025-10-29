import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3006,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:3005'
    }
  }
})
