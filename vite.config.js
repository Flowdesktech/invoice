import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Invoice Management System',
        short_name: 'Invoice Manager',
        description: 'Professional Invoice Management System',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    // Optimize bundle splitting
    rollupOptions: {
      output: {
        // Create separate chunks for vendor libraries
        manualChunks: {
          // React ecosystem in one chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Material UI in separate chunk (it's large)
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers'],
          // Firebase SDK in separate chunk
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Other utilities
          'utils-vendor': ['date-fns', 'axios', 'react-hot-toast'],
        },
        // Use content hash for better caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Increase chunk size warning limit slightly
    chunkSizeWarningLimit: 600,
    // Minify for production
    minify: 'esbuild',
    // Better tree shaking
    treeshake: {
      moduleSideEffects: false,
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
    ],
  }
})
