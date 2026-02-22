import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type{ Product } from "../types/product";
import { fetchProductsByCategory } from "../apis/categories";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 20;
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [category]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await fetchProductsByCategory(category || "");
    setProducts(result);
    setFilteredProducts(result);
    setIsLoading(false);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const resetFilters = () => {
    setFilteredProducts(products);
    setCurrentPage(1);
  };

  if (isLoading || products.length === 0) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-screen mx-auto bg-rose min-h-screen">
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
            <h2 className="text-3xl font-bold mb-6 text-plum border-b-2 border-lavender pb-2 text-center">
              All Products
            </h2>

            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray">
                  No products found matching your criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product.Product_id}
                      className="bg-white shadow-lg rounded-sm overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/recommend/${product.Product_id}`)}
                    >
                      <img src={product.image_url} alt={product.BrandName} className="w-full object-fill" />
                      <div className="flex items-center space-x-1 p-2">
                        <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                          {product.Ratings} ★
                        </span>
                        <span className="text-gray-500 text-sm">({product.Reviews})</span>
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold text-lg">{product.BrandName}</h3>
                        <p className="text-gray-500 text-sm">{product.Individual_category}</p>
                        <div className="mt-2 flex flex-col md:flex-row items-center md:justify-around">
                          <div className="flex justify-between items-center w-3/5">
                            <span className="text-lg font-bold text-gray-900">Rs. {product.OriginalPrice}</span>
                            <span className="text-gray-400 line-through">Rs. {product.OriginalPrice}</span>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 mx-2 border rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-plum text-white"
                        }`}
                    >
                      Previous
                    </button>
                    <span className="text-lg font-semibold mx-4">
                      Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`px-4 py-2 mx-2 border rounded ${currentPage === totalPages || totalPages === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-plum text-white"
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
}
