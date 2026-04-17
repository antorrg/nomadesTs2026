import type { Method } from 'axios';

export interface RequestConfig {
  method: Method;
  endpoint: string;
  data?: unknown;
  params?: Record<string, unknown>;
}

export type HttpMethod = Method;

interface HttpClientOptions {
  getToken?: () => string | null;
  withCredentials?: boolean;
  requireAuth?: boolean;
}

export class HttpClient {
  private baseURL: string;
  private getToken?: () => string | null;
  private withCredentials: boolean;
  private requireAuth: boolean;

  constructor(baseURL: string, options: HttpClientOptions = {}) {
    this.baseURL = baseURL;
    this.getToken = options.getToken;
    this.withCredentials = options.withCredentials ?? false;
    this.requireAuth = options.requireAuth ?? false;
  }

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    const headers: Record<string, string> = {};
    const body = this.buildBody(config.data, headers);

    if (this.requireAuth) {
      const token = this.getToken?.();
      if (!token) throw new Error('Token no encontrado');
      headers.Authorization = `Bearer ${token}`;
    }

    const url = this.buildURL(config.endpoint, config.params);

    const response = await fetch(url, {
      method: config.method,
      headers,
      body,
      credentials: this.withCredentials ? 'include' : 'same-origin'
    });

    return this.handleResponse<T>(response);
  }

  private buildURL(endpoint: string, params?: Record<string, unknown>): string {
    const normalizedBaseURL = this.baseURL.replace(/\/+$/, '');
    const normalizedEndpoint = endpoint.replace(/^\/+/, '');

    const url = new URL(`${normalizedBaseURL}/${normalizedEndpoint}`);

    if (!params) return url.toString();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null) {
            url.searchParams.append(key, String(item));
          }
        }
      } else {
        url.searchParams.append(key, String(value));
      }
    }

    return url.toString();
  }

  private buildBody(
    data: unknown,
    headers: Record<string, string>
  ): BodyInit | undefined {
    if (data === undefined || data === null) {
      return undefined;
    }

    if (data instanceof FormData) {
      return data;
    }

    if (this.isBodyInit(data)) {
      return data;
    }

    headers['Content-Type'] = 'application/json';
    return JSON.stringify(data);
  }

  private isBodyInit(value: unknown): value is BodyInit {
    return (
      typeof value === 'string' ||
      value instanceof Blob ||
      value instanceof URLSearchParams ||
      value instanceof ArrayBuffer ||
      ArrayBuffer.isView(value)
    );
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    if (response.status === 204) {
      return '' as unknown as T;
    }

    if (isJson) {
      return (await response.json()) as T;
    }

    return (await response.text()) as T;
  }
}