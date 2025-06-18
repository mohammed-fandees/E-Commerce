import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['@rollup/rollup-linux-x64-gnu'],
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    open: true,
  },
})
