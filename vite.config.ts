import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: el build funciona servido desde cualquier carpeta (intranet, SharePoint, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
});
