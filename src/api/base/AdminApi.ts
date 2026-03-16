 import { HttpClient, type RequestConfig } from './HttpClient';
 import { type SweetAlertOptions } from 'sweetalert2';
 import { MySwal } from '../../utils/sweetalert';
import { toast } from 'react-toastify';

export type ConfirmFn = (options: SweetAlertOptions) => Promise<boolean>;

export type NotifyFn = {
  success(message: string): void;
  error(message: string): void;
};
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  results: T;
}
interface ExecuteOptions<T> {
  request: RequestConfig;
  confirm?: SweetAlertOptions;
  hasMessage?:boolean;
  successMessage?: string|null|undefined;
  errorMessage?: string;
  success?: (data: T) => void;
  reject?: (error: unknown) => void;
}
//* SweetAler y toastify

const defaultConfirm: ConfirmFn = async (options) => {
  const result = await MySwal.fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar',
    ...options,
  });
  return result.isConfirmed;
};

const defaultNotify: NotifyFn = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
};


export class AdminApi {
  constructor(
    private http: HttpClient,
    private notify: NotifyFn = defaultNotify,
    private confirm: ConfirmFn = defaultConfirm,
  ) {}

  async execute<T>({
    request,
    confirm: confirmOptions,
    hasMessage,
    successMessage,
    errorMessage,
    success,
    reject,
  }: ExecuteOptions<T>): Promise<T | void> {
    try {
      if (confirmOptions) {
        const confirmed = await this.confirm(confirmOptions);
        if (!confirmed) return
      }

      const response = await this.http.request<ApiResponse<T>>(request);

      if (hasMessage) {
        this.notify.success(successMessage ?? response.message);
      }

      success?.(response.results);
      return response.results;

    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      this.notify.error(backendMessage ?? errorMessage ?? 'Error desconocido');
      //console.error(error)
      reject?.(error);
    }
  }

  async confirmAction(options: SweetAlertOptions): Promise<boolean> {
  const result = await this.confirm(options);
  return result;
}

}
