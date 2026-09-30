import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: el build funciona servido desde cualquier carpeta (intranet, SharePoint, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    // En desarrollo, /api va al servidor (npm run dev:server). Si no está corriendo, la app usa modo local.
    proxy: { '/api': { target: 'http://localhost:8787', changeOrigin: true } },
  },
  // `vite preview` se comporta como un hosting estático (modo local).
  preview: { proxy: {} },
});
