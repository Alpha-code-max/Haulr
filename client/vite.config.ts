import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'zustand',
      'zustand/middleware',
      'axios',
      'leaflet',
      'react-leaflet',
      'lucide-react',
      'react-icons/fi',
      'react-icons/bi',
      'react-icons/bs',
      'react-icons/md',
      'react-icons/ai',
      'react-icons/hi',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    hmr: {
      host: '127.0.0.1',
      protocol: 'ws',
      port: 5173,
      clientPort: 5173,
    },
  },
})
