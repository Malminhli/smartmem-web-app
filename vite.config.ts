import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
// @ts-ignore
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // *** إضافة مسار القاعدة لحل مشكلة التصميم ***
  base: './', 
  plugins: [react( )],
  root: resolve(__dirname, 'client'),
  build: {
    outDir: resolve(__dirname, 'client/dist'),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'client/src'),
      // *** إضافة مسار @shared لحل مشكلة البناء ***
      '@shared': resolve(__dirname, 'shared'), 
    },
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
