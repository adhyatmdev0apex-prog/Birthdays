import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  server: { host: true, port: 5173 },
  preview: { allowedHosts: ['birthdays-new.onrender.com'] },
  build: { target: 'es2020' }
});
