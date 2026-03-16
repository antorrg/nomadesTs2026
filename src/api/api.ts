import { HttpClient } from "./base/HttpClient";
import { AdminApi } from "./base/AdminApi";

const baseURL = `${import.meta.env.VITE_BASE_URL}/api/v1`|| '/api/v1';


const publicHttp = new HttpClient(baseURL, {withCredentials: false, requireAuth: false})

const adminHttp = new HttpClient(baseURL, {withCredentials: true, requireAuth: true})

export const publicApi = new AdminApi(publicHttp)

export const adminApi = new AdminApi(adminHttp)