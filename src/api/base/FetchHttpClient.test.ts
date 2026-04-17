import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpClient } from './FetchHttpClient';

describe('FetchHttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('permite métodos lowercase y normaliza la URL', async () => {
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });

    const fetchMock = vi.fn(async () => response);
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient('https://api.example.com/', {
      withCredentials: false,
      requireAuth: false
    });

    const result = await client.request({
      method: 'get',
      endpoint: '/test',
      params: { page: 1 }
    });

    expect(result).toEqual({ success: true });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/test?page=1',
      expect.objectContaining({
        method: 'get'
      })
    );
  });

  it('arroja error si requireAuth está activado y no hay token', async () => {
    const client = new HttpClient('https://api.example.com', {
      withCredentials: false,
      requireAuth: true
    });

    await expect(
      client.request({
        method: 'GET',
        endpoint: '/private'
      })
    ).rejects.toThrow('Token no encontrado');
  });

  it('incluye Authorization cuando hay token y requireAuth está activado', async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });

    const fetchMock = vi.fn(async () => response);
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient('https://api.example.com', {
      withCredentials: false,
      requireAuth: true,
      getToken: () => 'token-123'
    });

    await client.request({ method: 'GET', endpoint: '/private' });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/private',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer token-123' })
      })
    );
  });

  it('devuelve cadena vacía en respuestas 204', async () => {
    const response = new Response(null, {
      status: 204,
      headers: { 'content-type': 'application/json' }
    });

    const fetchMock = vi.fn(async () => response);
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient('https://api.example.com', {
      withCredentials: false,
      requireAuth: false
    });

    const result = await client.request({ method: 'GET', endpoint: '/empty' });

    expect(result).toBe('');
  });
});
