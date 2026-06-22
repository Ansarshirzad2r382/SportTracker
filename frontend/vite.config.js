import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    //Server ist auch von außen erreichbar, also nicht nur auf localhost
    host: true,
    port: 5173,
    //Alle externen hosts sind erlaubt
    allowedHosts: true,

    proxy: {
      // Using the proxy instance
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  }
})