import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi } from '../api/authApi';
import type { AuthState } from '../types/auth';
import interceptor from '../api/network/interceptor';

interface AuthContextType extends AuthState {
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        loading: true,
    });

    const checkAuth = async () => {
        // Optimización: Si no existe la cookie 'logged_in', no hacemos la petición
        // Esto evita 401s innecesarios en la primera carga si el usuario no está logueado
        if (!document.cookie.includes('logged_in=true')) {
            setState({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
            return;
        }

        try {
            const data = await authApi.me();
            if (data) {
                setState({
                    user: data,
                    isAuthenticated: true,
                    loading: false,
                });
            } else {
                throw new Error();
            }
        } catch (error) {
            setState({
                user: null,
                isAuthenticated: false,
                loading: false,
            });
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
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


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
