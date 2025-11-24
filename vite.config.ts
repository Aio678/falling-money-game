import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Use absolute path for Cloudflare Pages root deployment
  build: {
    target: 'es2015', // Transpile to older JS syntax for mobile compatibility
    outDir: 'dist', // Standard Vite output directory
    emptyOutDir: true,
  }
});