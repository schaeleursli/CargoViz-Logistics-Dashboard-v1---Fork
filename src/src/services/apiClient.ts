import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';

// Define API error interface for better error handling
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, unknown>;
  timestamp?: string;
}

// Helper to unwrap API responses
export const unwrap = <T,>(response: {
  data: {
    data: T;
  };
}): T => response.data.data;

// Configuration options for the API client
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Create a class that can be extended for different API services
export class ApiClient {
  protected client: AxiosInstance;
  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {})
      }
    });

    // Request interceptor for auth token
    this.client.interceptors.request.use((config: AxiosRequestConfig) => {
      const token = localStorage.getItem('cargoviz_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, error => Promise.reject(error));
  }

  // Helper methods for making requests with proper typing
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<{
      data: T;
    }>(url, config);
    return response.data.data;
  }
  protected async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<{
      data: T;
    }>(url, data, config);
    return response.data.data;
  }
  protected async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<{
      data: T;
    }>(url, data, config);
    return response.data.data;
  }
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<{
      data: T;
    }>(url, config);
    return response.data.data;
  }

  // Expose axios instance for interceptors
  get axios(): AxiosInstance {
    return this.client;
  }
}

// Auth interceptor installation function
export const installAuthInterceptor = (navigate: ReturnType<typeof useNavigate>) => {
  // Get API URL with fallbacks
  const apiUrl = typeof __API_URL__ !== 'undefined' && __API_URL__ ? __API_URL__ : (window as any)._env_?.CARGOVIZ_API_URL ??
  // runtime fallback for iframe previews
  'https://api.cargoviz.com/api';
  // Create a singleton API client for global interceptors
  const apiClient = new ApiClient({
    baseURL: apiUrl
  });
  apiClient.axios.interceptors.response.use(response => response, (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cargoviz_token');
      navigate('/login', {
        replace: true
      });
    }
    return Promise.reject(error);
  });
  return apiClient;
};