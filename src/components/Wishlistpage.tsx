import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../hooks/useStore';
import { AddToCartButton } from './Cartbuttons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Product {
    Product_id: number;
    BrandName: string;
    Description: string;
    OriginalPrice: number;
    DiscountOffer: string;
    image_url: string;
    Individual_category: string;
    Ratings: number;
    Reviews: number;
}

const WishlistPage = () => {
    const navigate = useNavigate();
    const { wishlistItems, removeFromWishlist } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (wishlistItems.length === 0) { setLoading(false); return; }
            setLoading(true);
            try {
                const fetched = await Promise.all(
                    wishlistItems.map(async (id) => {
                        const res = await fetch(`${API_URL}/products/${id}`);
                        const data = await res.json();
                        return res.ok ? data.data : null;
                    })
                );
                setProducts(fetched.filter(Boolean));
            } catch (e) {
                console.error('Failed to fetch wishlist products', e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [wishlistItems]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-blush flex items-center justify-center pt-16">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-wine border-t-transparent rounded-full animate-spin" />
                        <p className="text-wine font-medium">Loading your wishlist...</p>
                    </div>
                </div>
            </>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-blush flex flex-col items-center justify-center pt-16 gap-6">
                    <Heart size={64} className="text-wine opacity-30" />
                    <h2 className="text-2xl font-semibold text-wine">Your wishlist is empty</h2>
                    <p className="text-gray-500 text-sm">Save products you love to find them later</p>
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
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => navigate(-1)} className="text-wine hover:text-wine/70 transition-colors">
                            <ArrowLeft size={22} />
                        </button>
                        <h1 className="text-2xl font-bold text-wine">
                            My Wishlist
                            <span className="ml-2 text-base font-normal text-gray-500">
                                ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})
                            </span>
                        </h1>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                        {products.map((product) => (
                            <div
                                key={product.Product_id}
                                className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 relative flex flex-col"
                            >
                                {/* Remove from wishlist */}
                                <button
                                    className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow"
                                    onClick={() => removeFromWishlist(String(product.Product_id))}
                                    title="Remove from wishlist"
                                >
                                    <Heart size={16} className="fill-wine text-wine" />
                                </button>

                                {/* Image */}
                                <div className="cursor-pointer" onClick={() => navigate(`/recommend/${product.Product_id}`)}>
                                    <img
                                        src={product.image_url}
                                        alt={product.BrandName}
                                        className="w-full h-56 object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div
                                    className="p-3 flex-1 cursor-pointer"
                                    onClick={() => navigate(`/recommend/${product.Product_id}`)}
                                >
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                                            {product.Ratings} ★
                                        </span>
                                        <span className="text-gray-400 text-xs">({product.Reviews})</span>
                                    </div>
                                    <h3 className="font-semibold text-plum text-sm truncate">{product.BrandName}</h3>
                                    <p className="text-wine text-xs mt-0.5">{product.Individual_category}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="font-bold text-plum text-sm">₹{product.OriginalPrice}</span>
                                        {product.DiscountOffer && (
                                            <span className="text-red-500 text-xs">{product.DiscountOffer}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart */}
                                <div className="px-3 pb-3" onClick={(e) => e.stopPropagation()}>
                                    <AddToCartButton productId={product.Product_id} className="w-full" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Continue Shopping */}
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => navigate('/product')}
                            className="flex items-center gap-2 border border-wine text-wine px-6 py-3 rounded-lg font-medium hover:bg-wine hover:text-white transition-all"
                        >
                            <ShoppingBag size={18} /> Continue Shopping
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default WishlistPage;