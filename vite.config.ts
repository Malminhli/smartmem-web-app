import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { copyFileSync } from 'fs';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
// @ts-ignore
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
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
    },
  },
  // إضافة دالة لنسخ ملف _redirects بعد البناء
  // هذا يضمن أن Netlify تلتقط قاعدة إعادة التوجيه
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});

// إضافة وظيفة مخصصة لنسخ ملف _redirects
function copyRedirects() {
  return {
    name: 'copy-netlify-redirects',
    closeBundle() {
      const source = resolve(__dirname, 'client/_redirects');
      const destination = resolve(__dirname, 'client/dist/_redirects');
      try {
        copyFileSync(source, destination);
        console.log('Successfully copied _redirects file to dist folder.');
      } catch (error) {
        console.error('Error copying _redirects file:', error);
      }
    }
  };
}
