// src/pages/Occasion.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type{ Product } from "../types/product";
import { fetchOccasionByName } from "../apis/occasion";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Occasion: React.FC = () => {
    const [occasions, setOccasions] = useState < Product[] > ([]);
    const [filteredProducts, setFilteredProducts] = useState < Product[] > ([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;
    const navigate = useNavigate();
    const { occ_name } = useParams < { occ_name: string } > ();

    useEffect(() => {
        if (occ_name) {
            fetchOccasion();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [occ_name]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filteredProducts]);

    const fetchOccasion = async () => {
        try {
            setIsLoading(true);
            const result = await fetchOccasionByName(occ_name!);
            console.log("occasion - ",result.data);
            
            if (!result.error && result.data) {
                setOccasions(result.data.filtered_products);
                setFilteredProducts(result.data.filtered_products);
            } else {
                console.error(result.message);
            }
        } catch (err) {
            console.error("Error fetching occasion:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const resetFilters = () => {
        setFilteredProducts(occasions);
        setCurrentPage(1);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full max-w-screen mx-auto bg-rose min-h-screen">
            <div className="flex flex-col">
                <Navbar
                    products={occasions}
                    setFilteredProducts={setFilteredProducts}
                    resetFilters={resetFilters}
                />
                <div className="flex mt-[65px] h-[95vh]">
                    <div className="lg:w-1/6 hidden lg:block">
                        <Sidebar
                            products={occasions}
                            setFilteredProducts={setFilteredProducts}
                            resetFilters={resetFilters}
                        />
                    </div>
                    <div className="lg:w-5/6 w-full p-2 overflow-auto">
                        <h2 className="text-3xl font-bold mb-3 text-plum pb-2 text-center">
                            Explore Products for {occ_name}
                        </h2>

                        <div>
                            {filteredProducts.length === 0 ? (
                                <div className="flex justify-center items-center h-64">
                                    <p className="text-xl text-gray">
                                        {occasions.length === 0
                                            ? "No products available."
                                            : "No products found matching your criteria."}
                                    </p>
                                    {occasions.length > 0 && (
                                        <button
                                            onClick={resetFilters}
                                            className="ml-4 px-4 py-2 bg-plum text-white rounded hover:bg-opacity-80"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {filteredProducts.length !== occasions.length && (
                                        <div className="mb-4 text-center">
                                            <button
                                                onClick={resetFilters}
                                                className="mt-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                            >
                                                Show All Products
                                            </button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                        {currentProducts.map((product) => (
                                            <div
                                                key={product._id}
                                                className="bg-white shadow-lg rounded-sm overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                                                onClick={() =>
                                                    navigate(`/recommend/${product.Product_id}`)
                                                }
                                            >
                                                <img
                                                    src={product.image_url}
                                                    alt="Product"
                                                    className="w-full object-fill"
                                                />
                                                <div className="flex items-center space-x-1 p-2">
                                                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                                                        {product.Ratings} ★
                                                    </span>
                                                    <span className="text-gray-500 text-sm">
                                                        ({product.Reviews})
                                                    </span>
                                                </div>
                                                <div className="p-2">
                                                    <h3 className="font-semibold text-lg">
                                                        {product.BrandName}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">
                                                        {product.Individual_category}
                                                    </p>
                                                    <div className="mt-2 flex flex-col md:flex-row items-center md:justify-around">
                                                        <div className="flex justify-between items-center w-3/5">
                                                            <span className="text-lg font-bold text-gray-900">
                                                                Rs. {product.OriginalPrice}
                                                            </span>
                                                            <span className="text-gray-400 line-through">
                                                                Rs. {product.OriginalPrice}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span className="text-red-500 font-semibold">
                                                                ({product.DiscountOffer})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center mt-6">
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                                                }
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 mx-2 border rounded ${currentPage === 1
                                                        ? "bg-gray-300 cursor-not-allowed"
                                                        : "bg-plum text-white hover:bg-opacity-80"
                                                    }`}
                                            >
                                                Previous
                                            </button>
                                            <span className="text-lg font-semibold mx-4">
                                                Page {currentPage} of {totalPages || 1}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setCurrentPage((prev) =>
                                                        Math.min(prev + 1, totalPages)
                                                    )
                                                }
                                                disabled={currentPage === totalPages || totalPages === 0}
                                                className={`px-4 py-2 mx-2 border rounded ${currentPage === totalPages || totalPages === 0
                                                        ? "bg-gray-300 cursor-not-allowed"
                                                        : "bg-plum text-white hover:bg-opacity-80"
                                                    }`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Occasion;
