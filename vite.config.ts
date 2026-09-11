import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_ oneki olmayan degiskenleri de oku; bunlar sadece burada kullanilir, tarayiciya gitmez.
  const env = loadEnv(mode, process.cwd(), '');

  // Gelistirmede /api ve /uploads isteklerini backend'e aktar — canlidaki nginx'in
  // (ops/nginx/frontend.conf) yaptiginin aynisi. VITE_API_BASE_URL verilmediginde
  // apiService istekleri sayfanin kendi adresine gonderiyor; eskiden bunlar Vite'a
  // gidip index.html donuyordu ve ana sayfa bu yuzden cokuyordu.
  // Farkli bir backend icin: DEV_API_PROXY_TARGET=https://... npm run dev
  const apiTarget = env.DEV_API_PROXY_TARGET || 'http://localhost:8080';

  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true, secure: true },
        '/uploads': { target: apiTarget, changeOrigin: true, secure: true },
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Nadiren degisen kutuphaneler ayri dosyada: site guncellenince kullanicinin
          // tarayicisi bunlari yeniden indirmek zorunda kalmaz (onbellekte kalir).
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          },
        },
      },
    },
  };
});
