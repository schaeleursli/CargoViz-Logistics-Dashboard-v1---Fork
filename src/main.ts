import { createApp } from 'vue'
import { router } from './router'
import './index.css'
import App from './App.vue'

const isDevelopment = process.env.NODE_ENV === 'development'
const apiUrl = typeof __API_URL__ !== 'undefined' ? __API_URL__ : null
if (isDevelopment && !apiUrl) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  __API_URL__ is empty – check VITE_CARGOVIZ_API_URL in .env.local')
}

createApp(App).use(router).mount('#app')
