import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import type { Product } from "../types/product";
import type { Result } from "../types/result";
import { fetchAllProducts } from "../apis/products";

const AllProduct: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 20;
  const navigate = useNavigate();

    useEffect(() => {
      const loadProducts = async () => {
        try {
          setIsLoading(true);
          const response: Result = await fetchAllProducts();
          console.log( "response data ", response.data);
          setProducts(response.data || []);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
  
      loadProducts();
    }, []);

  const resetFilters = () => {
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (isLoading || products.length === 0) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-screen bg-rose min-h-screen pb-5">
      <div className="flex flex-col">
        <Navbar
          products={products}
          setFilteredProducts={setFilteredProducts}
          resetFilters={resetFilters}
        />
        <div className="flex mt-[65px] h-[95vh]">
          <div className="lg:w-1/6">
            <Sidebar
              products={products}
              setFilteredProducts={setFilteredProducts}
              resetFilters={resetFilters}
            />
          </div>
          <div className="lg:w-5/6 w-full px-4 overflow-auto">
            <div className="flex justify-center">
              <h2 className="text-3xl font-bold mb-6 text-plum border-b-2 border-lavender w-1/3 py-2 text-center">
                Explore Products
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-xl text-wine font-semibold">
                  No products match your filters. Try different criteria or clear filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product.Product_id}
                      className="bg-white shadow-lg rounded-sm overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                      onClick={() => navigate(`/recommend/${product.Product_id}`)}
                    >
                      <img
                        src={product.image_url}
                        alt={product.BrandName}
                        className="w-full h-64 object-cover"
                      />
                      <div className="flex items-center space-x-1 p-2">
                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                          {product.Ratings} ★
                        </span>
                        <span className="text-gray-500 text-sm">({product.Reviews})</span>
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg text-plum">{product.BrandName}</h3>
                        <p className="text-wine text-sm">{product.Individual_category}</p>
                        <div className="mt-2 flex flex-col md:flex-row items-center md:justify-around">
                          <div className="flex justify-between items-center w-3/5">
                            <span className="text-lg font-bold text-plum">
                              Rs. {product.OriginalPrice}
                            </span>
                            <span className="text-wine line-through">
                              Rs. {product.OriginalPrice}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-rose font-semibold">
                              ({product.DiscountOffer})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 mb-4">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 mx-2 border rounded-md ${currentPage === 1
                          ? "bg-moonstone text-wine cursor-not-allowed"
                          : "bg-plum text-white hover:bg-wine transition-all duration-300"
                        }`}
                    >
                      Previous
                    </button>
                    <span className="text-lg font-semibold text-plum mx-4">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 mx-2 border rounded-md ${currentPage === totalPages
                          ? "bg-moonstone text-wine cursor-not-allowed"
                          : "bg-plum text-white hover:bg-wine transition-all duration-300"
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
  );
};

export default AllProduct;
