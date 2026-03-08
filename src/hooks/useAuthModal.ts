import { useState, useEffect } from 'react';

export const useAuthModal = () => {
    const [authModal, setAuthModal] = useState<{ open: boolean; tab: 'login' | 'signup' }>({
        open: false,
        tab: 'login',
    });

    useEffect(() => {
        const handler = (e: Event) => {
            const tab = (e as CustomEvent).detail?.tab ?? 'login';
            console.log('[useAuthModal] open-auth event received, tab:', tab);
            setAuthModal({ open: true, tab });
        };
        window.addEventListener('open-auth', handler);
        return () => window.removeEventListener('open-auth', handler);
    }, []);

    const openAuth = (tab: 'login' | 'signup' = 'login') => {
        console.log('[useAuthModal] openAuth called, tab:', tab);
        setAuthModal({ open: true, tab });
    };

    const closeAuth = () => {
        console.log('[useAuthModal] closeAuth called');
        setAuthModal({ open: false, tab: 'login' });
    };

    console.log('[useAuthModal] current state:', authModal);

    return { authModal, openAuth, closeAuth };
};