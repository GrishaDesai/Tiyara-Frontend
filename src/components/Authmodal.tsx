import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useStore';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultTab?: 'login' | 'signup';
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose, defaultTab = 'login' }) => {
    const { login, signup } = useAuth();

    const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ✅ Sync tab when defaultTab prop changes (e.g. login vs signup button)
    useEffect(() => {
        console.log('[AuthModal] defaultTab changed:', defaultTab, '| isOpen:', isOpen);
        setTab(defaultTab);
    }, [defaultTab, isOpen]);

    console.log('[AuthModal] render — isOpen:', isOpen, '| tab:', tab);

    if (!isOpen) return null;

    const resetForm = () => {
        setName(''); setEmail(''); setPassword('');
        setError(''); setShowPass(false);
    };

    const switchTab = (t: 'login' | 'signup') => {
        setTab(t);
        resetForm();
    };

    const handleSubmit = async () => {
        setError('');
        if (!email || !password) { setError('Please fill in all fields'); return; }
        if (tab === 'signup' && !name) { setError('Name is required'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

        setLoading(true);
        try {
            if (tab === 'login') {
                await login(email, password);
            } else {
                await signup(name, email, password);
            }
            resetForm();
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[999]" onClick={onClose} />

            {/* Modal — z-[1000] ensures it's above navbar (z-50) */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[1000] w-full max-w-md p-8">

                {/* Close */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-wine transition-colors"
                    onClick={onClose}
                >
                    <X size={22} />
                </button>

                {/* Title */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-wine tracking-wide">
                        {tab === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {tab === 'login' ? 'Sign in to your Tiyara account' : 'Join Tiyara today'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    {(['login', 'signup'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => switchTab(t)}
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${tab === t ? 'bg-wine text-white shadow-sm' : 'text-gray-500 hover:text-wine'
                                }`}
                        >
                            {t === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4">
                    {tab === 'signup' && (
                        <div>
                            <label className="text-xs font-medium text-gray-600 mb-1 block uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-wine transition-colors"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-wine transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-medium text-gray-600 mb-1 block uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-wine transition-colors pr-10"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-wine"
                                onClick={() => setShowPass(p => !p)}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-wine text-white py-3 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-70"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {tab === 'login' ? 'Login' : 'Create Account'}
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-5">
                    {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')} className="text-wine font-medium hover:underline">
                        {tab === 'login' ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </>
    );
};

export default AuthModal;