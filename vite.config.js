import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint2';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawTarget = env.VITE_OLLAMA_API_URL || 'https://ollama.com/api';
  // Base host without trailing /api
  const targetHost = rawTarget.replace(/\/api\/?$/, '') || 'https://ollama.com';

  return {
    plugins: [
      react(),
      eslint({
        lintOnStart: true,
        cache: false,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/ollama': {
          target: targetHost,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/ollama/, '/api'),
          headers: {
            Origin: targetHost,
            Referer: targetHost,
          },
        },
      },
    },
  };
});
