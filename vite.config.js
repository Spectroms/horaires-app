import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@utils': resolve(__dirname, './src/utils'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
      '@contexts': resolve(__dirname, './src/contexts'),
      'firebase/app': 'firebase/app/dist/index.esm.js',
      'firebase/auth': 'firebase/auth/dist/index.esm.js',
      'firebase/firestore': 'firebase/firestore/dist/index.esm.js'
    },
    mainFields: ['module', 'jsnext:main', 'jsnext', 'browser', 'main']
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    host: true, // Permet l'accès depuis le réseau local
    port: 5173, // Port par défaut
    open: true, // Ouvre automatiquement le navigateur
    watch: {
      usePolling: true // Améliore la détection des changements de fichiers
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    commonjsOptions: {
      include: [/firebase/, /node_modules/]
    },
    rollupOptions: {
      external: ['firebase'],
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['jspdf', 'html2canvas', 'file-saver', 'xlsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
