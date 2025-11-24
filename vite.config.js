import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: './'
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  optimizeDeps: {
    // Force re-optimize when dependencies change
    force: false,
    // Include react-dom explicitly to prevent optimization issues
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
    ],
    // Exclude problematic dependencies from pre-bundling if needed
    exclude: [],
  },
  server: {
    // Increase timeout for dependency optimization
    hmr: {
      overlay: true,
    },
  },
});
