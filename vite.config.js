import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  // Pre-bundle heavy deps so first-request transform is instant
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'antd',
      '@ant-design/icons',
      'moment',
      'millify',
      'chart.js',
      'react-chartjs-2',
      'html-react-parser',
    ],
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('react-redux') || id.includes('@reduxjs/toolkit')) {
              return 'redux';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'charts';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd';
            }
            if (id.includes('moment')) {
              return 'moment';
            }
            // Default vendor chunk for other node_modules
            return 'vendor';
          }
        }
      }
    }
  },
});