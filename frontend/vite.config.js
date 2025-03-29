import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Para permitir conexiones desde red
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Ajusta esta URL al puerto donde corre tu backend
        changeOrigin: true,
      },
    }
  }
})
