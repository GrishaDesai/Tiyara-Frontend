export interface CartItem {
    product_id: string;
    quantity: number;
}

export interface CartContextType {
    cartItems: CartItem[];
    wishlistItems: string[];
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInCart: (productId: string) => boolean;
    isInWishlist: (productId: string) => boolean;
    cartCount: number;
}