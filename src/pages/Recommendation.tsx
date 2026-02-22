import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchRecommendations } from "../apis/products";
import type { Product } from "../types/product";
import type { Recommendation } from "../types/product";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";

export default function RecommendationPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const products: Product[] = [];

    const param = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (param.id) {
            loadRecommendations(param.id);
        }
    }, [param.id]);

    const loadRecommendations = async (id: string) => {
        setIsLoading(true);
        setError("");

        const result = await fetchRecommendations(id);

        console.log("rec res - ", result);

        if (result.error || !result.data) {
            setError(result.message);
            setRecommendations([]);
            setProduct(null);
        } else {
            setRecommendations(result.data.recommendations);
            setProduct(result.data.product);
        }

        setIsLoading(false);
    };

    return (
        <div className="scrollbar-custom max-h-screen overflow-auto">
            <h1 className="text-xl font-bold mb-2">Clothing Recommendation System</h1>

            {isLoading && <Loader />}

            <Navbar
                products={products}
                setFilteredProducts={() => { }}
                resetFilters={() => { }}
            />

            <div className="w-full max-w-screen min-h-screen">
                {product && (
                    <div className="w-full bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                        {/* Product Image */}
                        <div className="w-full md:w-1/2">
                            <img
                                src={product.image_url}
                                alt={product.Description}
                                className="w-full h-auto object-cover rounded-lg shadow-md hover:opacity-95 transition-opacity"
                            />
                        </div>

                        {/* Product Details */}
                        <div className="w-full md:w-1/2 flex flex-col gap-5 justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-plum mb-2">{product.BrandName}</h1>
                                <p className="text-wine font-semibold mt-2 text-lg capitalize">{product.Description}</p>
                                <p className="text-rose font-semibold mt-2 text-lg mb-4">
                                    {product.Category} - {product.Individual_category}
                                </p>

                                {/* Ratings and Reviews */}
                                <div className="flex items-center space-x-3 my-5">
                                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full flex items-center">
                                        {product.Ratings} ★
                                    </span>
                                    <span className="text-wine text-sm">{product.Reviews} Reviews</span>
                                </div>

                                {/* Pricing */}
                                <div className="mt-4 flex items-center">
                                    <span className="text-2xl font-bold text-plum">₹{product.OriginalPrice}</span>
                                    {product.DiscountOffer && (
                                        <span className="text-red-500 font-semibold ml-3 text-lg">
                                            {product.DiscountOffer}
                                        </span>
                                    )}
                                </div>

                                {/* Size Selection */}
                                {product.SizeOption && (
                                    <div className="mt-7">
                                        <h3 className="text-plum font-bold uppercase tracking-wider text-md mb-4">Select Size</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {product.SizeOption.split(",").map((size, index) => (
                                                <span
                                                    key={index}
                                                    className="border-2 border-wine text-wine px-5 py-2 rounded-full cursor-pointer hover:border-gray-800 hover:bg-gray-50 transition-colors text-center min-w-12"
                                                >
                                                    {size.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex-1 transition-colors">
                                    ADD TO BAG
                                </button>
                                <button className="border-2 border-wine text-wine hover:border-gray-800 px-6 py-3 rounded-lg font-semibold flex-1 transition-colors">
                                    WISHLIST
                                </button>
                            </div>

                            {/* Product Link */}
                            {product.URL && (
                                <div className="mt-6 text-sm text-gray-500">
                                    <a
                                        href={product.URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                                    >
                                        View on Myntra
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Recommendations */}
            <div className="w-full max-w-screen grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4 mt-4">
                {recommendations.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-lg rounded-sm overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/recommend/${item.recommended_product.Product_id}`)}
                    >
                        <img
                            src={item.recommended_product.image_url}
                            alt={item.recommended_product.Description}
                            className="w-full object-cover"
                        />
                        <div className="flex items-center space-x-1 p-2">
                            <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                                {item.recommended_product.Ratings} ★
                            </span>
                            <span className="text-gray-500 text-sm">({item.recommended_product.Reviews})</span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg">{item.recommended_product.BrandName}</h3>
                            <p className="text-gray-500 text-sm">{item.recommended_product.Individual_category}</p>
                            <div className="mt-2 flex items-center space-x-2">
                                <span className="text-lg font-bold text-gray-900">Rs. {item.recommended_product.OriginalPrice}</span>
                                <span className="text-gray-400 line-through">Rs. {item.recommended_product.OriginalPrice}</span>
                                <span className="text-red-500 font-semibold">
                                    ({item.recommended_product.DiscountOffer})
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
}