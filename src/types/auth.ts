import type { AuthUser } from './user';

export type LogoutFunction = () => Promise<void>;
export type RedirectToError = (status: number | string, message: string) => void;

export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
}