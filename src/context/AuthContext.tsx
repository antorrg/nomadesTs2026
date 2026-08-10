import React, { createContext, use, useState, useEffect,  type ReactNode } from 'react';
import { authApi } from '../api/authApi';
import type { AuthState } from '../types/auth';
import interceptor from '../api/network/interceptor';

interface AuthContextType extends AuthState {
    login: (credentials: Record<string, unknown>) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>(() => {
        const hasCookie = typeof document !== 'undefined' && document.cookie.includes('logged_in=true');
        return {
            user: null,
            isAuthenticated: false,
            loading: hasCookie,
        };
    });

    const checkAuth = async () => {
        try {
            const data = await authApi.me();
            if (data) {
                setState({
                    user: data,
                    isAuthenticated: true,
                    loading: false,
                });
            } else {
                setState({
                    user: null,
                    isAuthenticated: false,
                    loading: false,
                });
            }
        } catch {
            setState({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    };

    useEffect(() => {
        if (!state.loading) return;
        let isMounted = true;

        authApi.me()
            .then((data) => {
                if (!isMounted) return;
                if (data) {
                    setState({ user: data, isAuthenticated: true, loading: false });
                } else {
                    setState({ user: null, isAuthenticated: false, loading: false });
                }
            })
            .catch(() => {
                if (!isMounted) return;
                setState({ user: null, isAuthenticated: false, loading: false });
            });

        return () => {
            isMounted = false;
        };
    }, [state.loading]);

    const login = async (credentials: Record<string, unknown>) => {
        const data = await authApi.login(credentials);
        if (data) {
            setState({
                user: data,
                isAuthenticated: true,
                loading: false,
            });
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (e) {
            console.error(e);
        } finally {
            setState({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    };

    useEffect(() => {
        // Setup Axios interceptor to trap 401s globally and force a logout redirect.
        interceptor(logout, (status, message) => {
            console.warn(`[Interceptor Auth] ${status} - ${message}`);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};


// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = use(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
