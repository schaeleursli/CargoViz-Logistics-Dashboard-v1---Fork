import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_CARGOVIZ_API_URL || 'https://api.cargoviz.com/api';
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      __API_URL__: JSON.stringify(apiUrl),
      __LOGIN_PATH__: JSON.stringify(env.VITE_CARGOVIZ_LOGIN_PATH || '/auth/login'),
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VITE_CARGOVIZ_API_URL: JSON.stringify(apiUrl)
      }
    }
  };
});
