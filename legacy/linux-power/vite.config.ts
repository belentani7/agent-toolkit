import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// El sitio se publica bajo /linux-power/, asi que las rutas de los assets
// tienen que ser relativas: con base absoluta los enlaces dan 404 en Pages.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  build: { outDir: 'dist', emptyOutDir: true },
});
