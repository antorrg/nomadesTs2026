import { HttpClient } from "./base/HttpClient";
import { AdminApi } from "./base/AdminApi";

const rawBase = import.meta.env.VITE_BASE_URL?.trim();
const baseURL = rawBase ? `${rawBase.replace(/\/+$/, '')}/api/v1` : '/api/v1';

const publicHttp = new HttpClient(baseURL, {withCredentials: false, requireAuth: false})

const adminHttp = new HttpClient(baseURL, {withCredentials: true, requireAuth: false})

export const publicApi = new AdminApi({ http: publicHttp })

export const adminApi = new AdminApi({ http: adminHttp })