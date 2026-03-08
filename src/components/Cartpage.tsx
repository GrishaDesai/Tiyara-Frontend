import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../hooks/useStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Product {
    Product_id: number;
    BrandName: string;
    Description: string;
    OriginalPrice: number;
    DiscountOffer: string;
    image_url: string;
    Individual_category: string;
}

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [products, setProducts] = useState<Record<string, Product>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (cartItems.length === 0) { setLoading(false); return; }
            setLoading(true);
            try {
                const fetched: Record<string, Product> = {};
                await Promise.all(
                    cartItems.map(async (item) => {
                        const res = await fetch(`${API_URL}/products/${item.product_id}`);
                        const data = await res.json();
                        if (res.ok) fetched[item.product_id] = data.data;
                    })
                );
                setProducts(fetched);
            } catch (e) {
                console.error('Failed to fetch cart products', e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [cartItems]);

    const total = cartItems.reduce((sum, item) => {
        const product = products[item.product_id];
        return sum + (product ? product.OriginalPrice * item.quantity : 0);
    }, 0);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-blush flex items-center justify-center pt-16">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-wine border-t-transparent rounded-full animate-spin" />
                        <p className="text-wine font-medium">Loading your cart...</p>
                    </div>
                </div>
            </>
        );
    }

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-blush flex flex-col items-center justify-center pt-16 gap-6">
                    <ShoppingBag size={64} className="text-wine opacity-30" />
                    <h2 className="text-2xl font-semibold text-wine">Your cart is empty</h2>
                    <p className="text-gray-500 text-sm">Add some products to get started</p>
                    <button
                        onClick={() => navigate('/product')}
                        className="px-6 py-3 bg-wine text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                    >
                        Browse Products
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-blush pt-20 pb-12 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => navigate(-1)} className="text-wine hover:text-wine/70 transition-colors">
                            <ArrowLeft size={22} />
                        </button>
                        <h1 className="text-2xl font-bold text-wine">
                            My Cart
                            <span className="ml-2 text-base font-normal text-gray-500">
                                ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                            </span>
                        </h1>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Cart Items */}
                        <div className="flex-1 flex flex-col gap-4">
                            {cartItems.map((item) => {
                                const product = products[item.product_id];
                                if (!product) return null;
                                return (
                                    <div key={item.product_id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-start">
                                        <img
                                            src={product.image_url}
                                            alt={product.BrandName}
                                            className="w-24 h-28 object-cover rounded-lg cursor-pointer flex-shrink-0"
                                            onClick={() => navigate(`/recommend/${product.Product_id}`)}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3
                                                className="font-semibold text-plum text-base cursor-pointer hover:underline truncate"
                                                onClick={() => navigate(`/recommend/${product.Product_id}`)}
                                            >
                                                {product.BrandName}
                                            </h3>
                                            <p className="text-wine text-sm mt-0.5">{product.Individual_category}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-plum font-bold">₹{product.OriginalPrice}</span>
                                                {product.DiscountOffer && (
                                                    <span className="text-red-500 text-sm">{product.DiscountOffer}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center border border-wine rounded-lg overflow-hidden">
                                                    <button
                                                        className="px-2.5 py-1.5 text-wine hover:bg-wine hover:text-white transition-colors"
                                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-4 py-1.5 text-wine font-semibold text-sm border-x border-wine">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="px-2.5 py-1.5 text-wine hover:bg-wine hover:text-white transition-colors"
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                    onClick={() => removeFromCart(item.product_id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <button
                                onClick={clearCart}
                                className="self-start text-sm text-red-400 hover:text-red-600 transition-colors flex items-center gap-1.5 mt-1"
                            >
                                <Trash2 size={15} /> Clear all
                            </button>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-80">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                                <h2 className="text-lg font-bold text-wine mb-5 pb-3 border-b border-gray-100">
                                    Order Summary
                                </h2>
                                <div className="flex flex-col gap-3 text-sm">
                                    {cartItems.map((item) => {
                                        const product = products[item.product_id];
                                        if (!product) return null;
                                        return (
                                            <div key={item.product_id} className="flex justify-between text-gray-600">
                                                <span className="truncate max-w-[160px]">{product.BrandName} × {item.quantity}</span>
                                                <span className="font-medium text-plum">₹{(product.OriginalPrice * item.quantity).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-plum text-base">
                                    <span>Total</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <button className="w-full mt-6 bg-wine text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
                                    Proceed to Checkout
                                </button>
                                <button
                                    onClick={() => navigate('/product')}
                                    className="w-full mt-3 border border-wine text-wine py-3 rounded-lg font-semibold hover:bg-wine hover:text-white transition-all text-sm"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default CartPage;