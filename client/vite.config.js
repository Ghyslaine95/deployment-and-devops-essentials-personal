import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser', // or 'esbuild' if terser still causes issues
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true
  }
})