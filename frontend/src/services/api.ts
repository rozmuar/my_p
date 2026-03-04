import axios, { AxiosResponse, AxiosError } from 'axios';
import type { HttpRequest, HttpResponse, CodeGeneration, User } from '@/types';

class ApiService {
  private baseURL = '/api';

  private apiClient = axios.create({
    baseURL: this.baseURL,
    timeout: 30000,
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async executeRequest(request: HttpRequest, variables?: Record<string, string>): Promise<HttpResponse> {
    const startTime = Date.now();
    
    try {
      // Replace variables in URL and body
      let url = this.replaceVariables(request.url, variables);
      let body = request.body ? this.replaceVariables(request.body, variables) : undefined;

      // Parse JSON body if content-type is application/json
      if (body && request.headers['content-type']?.includes('application/json')) {
        try {
          body = JSON.parse(body);
        } catch {
          // Keep as string if not valid JSON
        }
      }

      const response: AxiosResponse = await this.apiClient.request({
        method: request.method,
        url,
        headers: request.headers,
        data: body,
        params: request.params,
        validateStatus: () => true, // Don't throw on HTTP error codes
      });

      const endTime = Date.now();
      const responseSize = JSON.stringify(response.data).length;

      return {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        time: endTime - startTime,
        size: responseSize,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(`Network Error: ${error.message}`);
      }
      
      throw new Error(`Request failed: ${error}`);
    }
  }

  async generateCode(request: HttpRequest, language: string): Promise<CodeGeneration> {
    try {
      const response = await this.apiClient.post('/code-generation', {
        request,
        language,
      });
      
      return response.data;
    } catch (error) {
      throw new Error('Failed to generate code');
    }
  }

  private replaceVariables(text: string, variables?: Record<string, string>): string {
    if (!variables) return text;
    
    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, value);
    });
    
    return result;
  }

  // Collection API
  async getCollections() {
    const response = await this.apiClient.get('/collections');
    return response.data;
  }

  async createCollection(collection: any) {
    const response = await this.apiClient.post('/collections', collection);
    return response.data;
  }

  async updateCollection(id: string, collection: any) {
    const response = await this.apiClient.put(`/collections/${id}`, collection);
    return response.data;
  }

  async deleteCollection(id: string) {
    await this.apiClient.delete(`/collections/${id}`);
  }

  async shareCollection(id: string, userEmail: string, role: string) {
    const response = await this.apiClient.post(`/collections/${id}/share`, {
      userEmail,
      role,
    });
    return response.data;
  }

  // Auth API
  async login(email: string, password: string) {
    const response = await this.apiClient.post('/auth/login', { email, password });
    return response.data;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.apiClient.post('/auth/register', { name, email, password });
    return response.data;
  }

  async logout() {
    await this.apiClient.post('/auth/logout');
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.apiClient.get('/auth/me');
    return response.data;
  }

  // Admin API
  async getUsers() {
    const response = await this.apiClient.get('/admin/users');
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>) {
    const response = await this.apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string) {
    await this.apiClient.delete(`/admin/users/${id}`);
  }
}

export const apiService = new ApiService();