import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// Define API error interface for better error handling
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}
// Enhanced response type with pagination and metadata
export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: {
    timestamp: string;
    [key: string]: any;
  };
}
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
    // Response interceptor for error handling
    this.client.interceptors.response.use((response: AxiosResponse) => response, (error: AxiosError) => {
      // Handle authentication errors
      if (error.response?.status === 401) {
        localStorage.removeItem('cargoviz_token');
        window.location.href = '/login';
      }
      // Transform error to standardized format
      const apiError: ApiError = {
        status: error.response?.status || 500,
        message: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      };
      if (error.response?.data?.errors) {
        apiError.errors = error.response.data.errors;
      }
      return Promise.reject(apiError);
    });
  }
  // Helper methods for making requests with proper typing
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }
  protected async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }
  protected async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }
}