import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
export default defineConfig(({
  mode
}) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {
      // Define compile-time constants
      __API_URL__: JSON.stringify(env.VITE_CARGOVIZ_API_URL ?? 'https://api.cargoviz.com/api'),
      // Ensure proper environment variable handling
      'process.env.NODE_ENV': JSON.stringify(mode)
    }
  };
});