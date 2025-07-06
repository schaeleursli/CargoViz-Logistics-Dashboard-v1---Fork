import axios, { AxiosRequestConfig } from 'axios';

/**
 * Only variables that start with VITE_ are exposed in a Vite app.
 * Fall back to the public API URL if the env-var is missing.
 */
const apiUrl =
  import.meta.env.VITE_CARGOVIZ_API_URL ?? 'https://api.cargoviz.com/api';

const apiClient = axios.create({ baseURL: apiUrl });

/**
 * Automatically inject the Bearer token (if we have one) on every request.
 */
apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('cargoviz_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
