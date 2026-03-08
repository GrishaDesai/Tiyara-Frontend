import { useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { CartContext } from '../contexts/Cartcontext';
import { AuthContext } from '../contexts/Authcontext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const auth = useContext(AuthContext);
    const token = auth?.token ?? null;
    const isAuthenticated = auth?.isAuthenticated ?? false;

    const [cartItems, setCartItems] = useState<{ product_id: string; quantity: number }[]>([]);
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);

    const authHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchCart();
            fetchWishlist();
        } else {
            setCartItems([]);
            setWishlistItems([]);
        }
    }, [isAuthenticated, token]);

    const fetchCart = async () => {
        try {
            const res = await fetch(`${API_URL}/cart`, { headers: authHeaders });
            const data = await res.json();
            if (res.ok) setCartItems(data.data || []);
        } catch { /* silent */ }
    };

    const fetchWishlist = async () => {
        try {
            const res = await fetch(`${API_URL}/wishlist`, { headers: authHeaders });
            const data = await res.json();
            if (res.ok) setWishlistItems(data.data || []);
        } catch { /* silent */ }
    };

    const addToCart = async (productId: string, quantity = 1) => {
        const res = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ product_id: productId, quantity }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to add to cart');
        setCartItems(data.data || []);
    };

    const removeFromCart = async (productId: string) => {
        const res = await fetch(`${API_URL}/cart/${productId}`, { method: 'DELETE', headers: authHeaders });
        const data = await res.json();
        if (res.ok) setCartItems(data.data || []);
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        const res = await fetch(`${API_URL}/cart/${productId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ quantity }),
        });
        const data = await res.json();
        if (res.ok) setCartItems(data.data || []);
    };

    const clearCart = async () => {
        const res = await fetch(`${API_URL}/cart`, { method: 'DELETE', headers: authHeaders });
        if (res.ok) setCartItems([]);
    };

    const addToWishlist = async (productId: string) => {
        const res = await fetch(`${API_URL}/wishlist`, {
            method: 'POST',
            headers: authHeaders,
            body: JSON.stringify({ product_id: productId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to add to wishlist');
        setWishlistItems(data.data || []);
    };

    const removeFromWishlist = async (productId: string) => {
        const res = await fetch(`${API_URL}/wishlist/${productId}`, { method: 'DELETE', headers: authHeaders });
        const data = await res.json();
        if (res.ok) setWishlistItems(data.data || []);
    };

    const isInCart = (id: string) => cartItems.some(i => i.product_id === id);
    const isInWishlist = (id: string) => wishlistItems.includes(id);
    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, wishlistItems,
            addToCart, removeFromCart, updateQuantity, clearCart,
            addToWishlist, removeFromWishlist,
            isInCart, isInWishlist, cartCount,
        }}>
            {children}
        </CartContext.Provider>
    );
};