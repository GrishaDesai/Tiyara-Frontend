import { useContext } from 'react';
import { AuthContext } from '../contexts/Authcontext';
import { CartContext } from '../contexts/Cartcontext';
import type { AuthContextType } from '../types/auth';
import type { CartContextType } from '../types/cart';

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
};