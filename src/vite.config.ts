import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig(({
  mode
}) => {
  // Load env file based on mode in the correct directory
  const env = loadEnv(mode, process.cwd(), '');
  // Get API URL with fallback
  const apiUrl = env.VITE_CARGOVIZ_API_URL || 'https://api.cargoviz.com/api';
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      // Ensure proper string wrapping and fall back for API URL
      __API_URL__: JSON.stringify(apiUrl),
      __LOGIN_PATH__: JSON.stringify(env.VITE_CARGOVIZ_LOGIN_PATH || '/auth/login'),
      // Add global process.env
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VITE_CARGOVIZ_API_URL: JSON.stringify(apiUrl)
      }
    }
  };
});