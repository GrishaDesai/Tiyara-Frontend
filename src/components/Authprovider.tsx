import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from '../contexts/Authcontext';
import type { User } from '../types/auth';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem('tiyara_token');
        const savedUser = localStorage.getItem('tiyara_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Login failed');
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('tiyara_token', data.data.token);
        localStorage.setItem('tiyara_user', JSON.stringify(data.data.user));
    };

    const signup = async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Signup failed');
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('tiyara_token', data.data.token);
        localStorage.setItem('tiyara_user', JSON.stringify(data.data.user));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('tiyara_token');
        localStorage.removeItem('tiyara_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};