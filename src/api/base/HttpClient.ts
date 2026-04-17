import axios, { type Method } from 'axios';

export interface RequestConfig {
  method: Method;
  endpoint: string;
  data?: unknown;
  params?: Record<string, unknown>;
}

interface HttpClientOptions {
  getToken?: () => string | null;
  withCredentials?: boolean;
  requireAuth?: boolean
}

export class HttpClient {
  private baseURL: string;
  private getToken?: () => string | null;
  private withCredentials: boolean;
  private requireAuth: boolean

  constructor(baseURL: string, options: HttpClientOptions = {}) {
    this.baseURL = baseURL;
    this.getToken = options.getToken;
    this.withCredentials = options.withCredentials ?? false;
    this.requireAuth = options.requireAuth ?? false
  }

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    const headers: Record<string, string> = {};

    if (this.requireAuth) {
      const token = this.getToken?.();
      if (!token) throw new Error('Token no encontrado');
      headers.Authorization = `Bearer ${token}`;
    }

    const url = this.buildURL(config.endpoint);

    const response = await axios<T>({
      method: config.method,
      url,
      data: config.data,
      params: config.params,
      headers,
      withCredentials: this.withCredentials,
    });

    return response.data;
  }

  private buildURL(endpoint: string): string {
    const normalizedBaseURL = this.baseURL.replace(/\/+$/, '');
    const normalizedEndpoint = endpoint.replace(/^\/+/, '');
    return `${normalizedBaseURL}/${normalizedEndpoint}`;
  }
}