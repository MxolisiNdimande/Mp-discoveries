// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react']
  },
  server: {
    proxy: {
      '/api': {
        // Match the backend PORT in .env (defaults to 3000 in this project)
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})