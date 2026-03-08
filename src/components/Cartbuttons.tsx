import { useState, type FC } from 'react';
import { ShoppingBag, Heart, Loader2, Check } from 'lucide-react';
import { useAuth, useCart } from '../hooks/useStore';

interface AddToCartButtonProps {
    productId: string | number;
    className?: string;
    variant?: 'full' | 'icon';
}

export const AddToCartButton: FC<AddToCartButtonProps> = ({
    productId,
    className = '',
    variant = 'full',
}) => {
    const { isAuthenticated } = useAuth();
    const { addToCart, isInCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const inCart = isInCart(String(productId));

    const handleClick = async () => {
        if (!isAuthenticated) {
            // Dispatch custom event so Navbar can open auth modal
            window.dispatchEvent(new CustomEvent('open-auth', { detail: { tab: 'login' } }));
            return;
        }
        if (inCart || loading) return;
        setLoading(true);
        try {
            await addToCart(String(productId));
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleClick}
                disabled={loading}
                title={inCart ? 'In cart' : 'Add to cart'}
                className={`p-2 rounded-full transition-all ${inCart ? 'bg-wine text-white' : 'bg-white text-wine border border-wine hover:bg-wine hover:text-white'
                    } ${className}`}
            >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={loading || inCart}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${inCart
                    ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                    : 'bg-wine text-white hover:bg-opacity-90'
                } disabled:opacity-70 ${className}`}
        >
            {loading ? (
                <Loader2 size={15} className="animate-spin" />
            ) : added || inCart ? (
                <Check size={15} />
            ) : (
                <ShoppingBag size={15} />
            )}
            {inCart ? 'In Cart' : added ? 'Added!' : 'Add to Cart'}
        </button>
    );
};


interface WishlistButtonProps {
    productId: string | number;
    className?: string;
    showLabel?: boolean;
}

export const WishlistButton: FC<WishlistButtonProps> = ({
    productId,
    className = '',
    showLabel = false,
}) => {
    const { isAuthenticated } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();

    const [loading, setLoading] = useState(false);
    const inWishlist = isInWishlist(String(productId));

    const handleClick = async () => {
        if (!isAuthenticated) {
            window.dispatchEvent(new CustomEvent('open-auth', { detail: { tab: 'login' } }));
            return;
        }
        setLoading(true);
        try {
            if (inWishlist) {
                await removeFromWishlist(String(productId));
            } else {
                await addToWishlist(String(productId));
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`flex items-center gap-1.5 transition-all ${className}`}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin text-wine" />
            ) : (
                <Heart
                    size={18}
                    className={`transition-all ${inWishlist ? 'fill-wine text-wine' : 'text-wine'}`}
                />
            )}
            {showLabel && (
                <span className="text-sm text-wine">{inWishlist ? 'Saved' : 'Wishlist'}</span>
            )}
        </button>
    );
};