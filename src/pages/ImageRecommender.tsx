import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchImageRecommendations } from "../apis/products";
import { Star, Upload, Camera, Sparkles, ShoppingBag } from "lucide-react";
import type { Product, ProductWithScore } from "../types/product";

// Loader Component
const Loader = () => (
    <div className="flex flex-col items-center justify-center py-16">
        <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-blush rounded-full animate-spin border-t-plum"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-rose opacity-20"></div>
        </div>
        <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-plum animate-pulse" />
            <p className="text-plum font-semibold text-lg animate-pulse">Finding similar products...</p>
            <Sparkles className="w-5 h-5 text-plum animate-pulse" />
        </div>
    </div>
);

// Image Preview Component
const ImagePreview = ({ preview }: { preview: string | null }) =>
    preview ? (
        <div className="mb-10 flex justify-center animate-fade-in">
            <div className="text-center">
                <h3 className="text-2xl font-bold text-wine mb-6 flex items-center justify-center space-x-2">
                    <Camera className="w-6 h-6 text-rose" />
                    <span>Your Upload</span>
                </h3>
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Uploaded"
                        className="w-80 h-80 object-cover rounded-3xl shadow-2xl border-4 border-moonstone transition-all duration-500 hover:scale-105 hover:shadow-rose/20 hover:border-rose"
                    />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-plum/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
            </div>
        </div>
    ) : null;

// Product Card Component
const ProductCard = ({
    product,
    score,
    index,
    onClick,
}: {
    product: Product;
    score: number;
    index: number;
    onClick: () => void;
}) => (
    <div
        className="bg-ivory shadow-lg rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose/20 group border border-moonstone hover:border-rose animate-slide-up"
        style={{ animationDelay: `${index * 100}ms` }}
        onClick={onClick}
    >
        <div className="relative overflow-hidden">
            <img
                src={product.image_url}
                alt={product.BrandName}
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 bg-wine text-ivory px-3 py-1 rounded-full text-sm font-semibold shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                {(score * 100).toFixed(1)}% match
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-5">
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center bg-blush px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-wine fill-current mr-1" />
                    <span className="text-wine font-semibold text-sm">{product.Ratings}</span>
                </div>
                <span className="text-gray text-sm">({product.Reviews} reviews)</span>
            </div>

            {/* Brand and Category */}
            <h3 className="font-bold text-xl text-plum mb-2 group-hover:text-wine transition-colors duration-300">
                {product.BrandName}
            </h3>
            <p className="text-wine text-sm mb-4 opacity-80">{product.Individual_category}</p>

            {/* Price Section */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-2xl font-bold text-plum">₹{product.OriginalPrice}</span>
                    {product.DiscountOffer && (
                        <span className="text-rose font-semibold text-sm bg-rose/10 px-2 py-1 rounded-lg mt-1 inline-block">
                            {product.DiscountOffer}
                        </span>
                    )}
                </div>
                <ShoppingBag className="w-6 h-6 text-rose opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </div>
    </div>
);

const ImageRecommender = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<ProductWithScore[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && typeof e.target.result === "string") {
                    setPreview(e.target.result);
                }
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const data = await fetchImageRecommendations(file);
            setRecommendations(data);
            console.log("recommended img : ", data);
        } catch (err) {
            console.error("Error fetching recommendations:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-ivory via-moonstone to-blush">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-plum mb-4">
                        Image Recommender
                    </h1>
                    <p className="text-wine text-lg opacity-80">
                        Upload an image and discover similar products
                    </p>
                </div>

                {/* Upload Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-12 border border-moonstone">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="file-upload"
                                className="flex flex-col items-center justify-center w-80 h-40 border-2 border-dashed border-rose rounded-2xl cursor-pointer bg-blush/30 hover:bg-blush/50 transition-all duration-300 hover:border-wine group"
                            >
                                <Upload className="w-12 h-12 text-rose mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <p className="text-wine font-semibold text-lg mb-2">Choose an image</p>
                                <p className="text-gray text-sm">PNG, JPG up to 10MB</p>
                            </label>
                        </div>

                        {file && (
                            <div className="text-center">
                                <p className="text-plum font-medium mb-4">Selected: {file.name}</p>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-gradient-to-r from-plum to-wine text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        "Get Recommendations"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Preview */}
                <ImagePreview preview={preview} />

                {/* Loading State */}
                {loading && <Loader />}

                {/* Recommendations Section */}
                {!loading && recommendations.length > 0 && (
                    <div className="animate-fade-in">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-plum mb-4 flex items-center justify-center space-x-3">
                                <Sparkles className="w-8 h-8 text-rose" />
                                <span>Similar Products</span>
                                <Sparkles className="w-8 h-8 text-rose" />
                            </h2>
                            <p className="text-wine text-lg">Found {recommendations.length} matching products</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {recommendations.map(({ product, score }, index) => (
                                <ProductCard
                                    key={product.Product_id}
                                    product={product}
                                    score={score}
                                    index={index}
                                    onClick={() => navigate(`/recommend/${product.Product_id}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && !preview && (
                    <div className="text-center py-16">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-blush/30 flex items-center justify-center">
                            <Camera className="w-16 h-16 text-rose opacity-50" />
                        </div>
                        <p className="text-wine text-xl font-medium">
                            Upload an image to discover similar products
                        </p>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out both;
                }
            `}</style>
        </div>
    );
};

export default ImageRecommender;