import { describe, it, expect, vi } from 'vitest';

// Mock dependencies BEFORE importing the module under test to prevent side effects
vi.mock('../../utils/sweetalert', () => ({
  getSwal: vi.fn().mockResolvedValue({
    fire: vi.fn(),
  }),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { AdminApi, type ApiResponse, type ConfirmFn } from './AdminApi';
import type { HttpClient } from './HttpClient';

// ------------------------------
// Helpers / fakes
// ------------------------------

const confirmTrue: ConfirmFn = () => Promise.resolve(true);
const confirmFalse: ConfirmFn = () => Promise.resolve(false);

const createNotify = () => ({
  success: vi.fn(),
  error: vi.fn(),
});

const createHttp = <T>(response: ApiResponse<T>) =>
  ({
    request: vi.fn().mockResolvedValue(response),
  }) as unknown as HttpClient;

// ------------------------------
// Tests
// ------------------------------

describe('AdminApi.execute', () => {

  it('devuelve results y muestra mensaje del servidor', async () => {
    const http = createHttp({
      success: true,
      message: 'Operación exitosa',
      results: { id: 1 },
    });

    const notify = createNotify();

    const api = new AdminApi(http, confirmTrue, notify);

    const result = await api.execute({
      request: { endpoint: '/test', method: 'GET' },
      hasMessage: true,
    });

    expect(result).toEqual({ id: 1 });
    expect(notify.success).toHaveBeenCalledWith('Operación exitosa');
    expect(http.request).toHaveBeenCalledOnce();
  });

  it('usa successMessage custom si está definido', async () => {
    const http = createHttp({
      success: true,
      message: 'Mensaje backend',
      results: { ok: true },
    });

    const notify = createNotify();
    const api = new AdminApi(http, confirmTrue, notify);

    await api.execute({
      request: { endpoint: '/custom', method: 'POST' },
      hasMessage: true,
      successMessage: 'Mensaje custom',
    });

    expect(notify.success).toHaveBeenCalledWith('Mensaje custom');
  });

  it('no ejecuta la request si el usuario cancela el confirm', async () => {
    const http = {
      request: vi.fn(),
    } as unknown as HttpClient;

    const notify = createNotify();
    const api = new AdminApi(http, confirmFalse, notify);

    const result = await api.execute({
      request: { endpoint: '/delete', method: 'DELETE' },
      confirm: { text: '¿Seguro?' },
    });

    expect(result).toBeUndefined();
    expect(http.request).not.toHaveBeenCalled();
    expect(notify.success).not.toHaveBeenCalled();
  });

  it('ejecuta success callback con results', async () => {
    const http = createHttp({
      success: true,
      message: 'OK',
      results: { value: 42 },
    });

    const notify = createNotify();
    const onSuccess = vi.fn();

    const api = new AdminApi(http, confirmTrue, notify);

    const result = await api.execute({
      request: { endpoint: '/callback', method: 'GET' },
      success: onSuccess,
    });

    expect(onSuccess).toHaveBeenCalledWith({ value: 42 });
    expect(result).toEqual({ value: 42 });
  });

  it('muestra toast de error si la request falla', async () => {
    const http = {
      request: vi.fn().mockRejectedValue(new Error('Boom')),
    } as unknown as HttpClient;

    const notify = createNotify();
    const onReject = vi.fn();

    const api = new AdminApi(http, confirmTrue, notify);

    await api.execute({
      request: { endpoint: '/fail', method: 'GET' },
      errorMessage: 'Error custom',
      reject: onReject,
    });

    expect(notify.error).toHaveBeenCalledWith('Error custom');
    expect(onReject).toHaveBeenCalled();
  });

  it('muestra el mensaje de error del backend si existe', async () => {
    const backendError = {
      response: {
        data: {
          success: false,
          message: 'Usuario no encontrado',
          results: '',
        },
      },
    };

    const http = {
      request: vi.fn().mockRejectedValue(backendError),
    } as unknown as HttpClient;

    const notify = createNotify();
    const onReject = vi.fn();

    const api = new AdminApi(http, confirmTrue, notify);

    await api.execute({
      request: { endpoint: '/fail-backend', method: 'GET' },
      reject: onReject,
    });

    expect(notify.error).toHaveBeenCalledWith('Usuario no encontrado');
    expect(onReject).toHaveBeenCalledWith(backendError);
  });

});
