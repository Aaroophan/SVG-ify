import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SVG-ify/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
