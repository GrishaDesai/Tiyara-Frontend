import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type{ IndividualCategory } from "../types/individualCategory";
import type{Product} from "../types/product";
import { fetchCategoryProducts } from "../apis/categories";
import "../App.css";
import "../index.css";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const CategoryProducts = () => {
  const [products, setProducts] = useState < Product[] > ([]);
  const [categories, setCategories] = useState<IndividualCategory[] > ([]);
  const [filteredProducts, setFilteredProducts] = useState < Product[] > ([]);
  const [currentPage, setCurrentPage] = useState < number > (1);
  const [selectedCategory, setSelectedCategory] = useState < string | null > (null);
  const [isLoading, setIsLoading] = useState < boolean > (false);

  const productsPerPage = 20;
  const { category } = useParams < { category: string } > ();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!category) return;
        setIsLoading(true);

        const { products, categories } = await fetchCategoryProducts(category);

        console.log("Product , category - ",products, categories);       

        setProducts(products);
        setCategories(categories);
        setFilteredProducts(products);
        setSelectedCategory(null);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setFilteredProducts(
      products.filter((p) => p.Individual_category === categoryName)
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilteredProducts(products);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  if (isLoading) return <Loader />;

  return (
    <>
      <Navbar
        products={products}
        setFilteredProducts={setFilteredProducts}
        resetFilters={resetFilters}
      />
      <div className="flex h-screen">
        <div className="lg:w-1/6 mt-[65px]">
          <Sidebar
            products={products}
            setFilteredProducts={setFilteredProducts}
            resetFilters={resetFilters}
          />
        </div>

        <div className="w-full md:w-5/6 mt-[65px] flex flex-col bg-rose/30">
          {/* Categories */}
          <div className="fixed top-[65px] w-full bg-gray-100 z-10 py-2">
            <div className="w-full flex gap-3 flex-nowrap overflow-x-auto">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 flex flex-col items-center font-bold px-3 py-2 rounded-lg text-sm cursor-pointer transition-transform duration-300 ease-in-out ${selectedCategory === cat.category
                      ? "scale-110 text-wine"
                      : "text-gray-800"
                    }`}
                  onClick={() => handleCategoryClick(cat.category)}
                >
                  <img
                    src={cat.image}
                    alt={cat.category}
                    className="w-20 h-20 md:w-32 md:h-32 lg:w-28 lg:h-28 rounded-full object-fit border-2 transition-all duration-300 ease-in-out"
                  />
                  <span className="mt-2 text-center text-xs md:text-sm">
                    {cat.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="mt-[180px] bg-gray-100 rounded-lg overflow-y-auto shadow-md max-h-screen px-4">
            {filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray-500">
                  No products match your filters. Try different criteria or
                  clear filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                {currentProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-sm overflow-hidden"
                    onClick={() => navigate(`/recommend/${product.Product_id}`)}
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
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex justify-center items-center mt-6 mb-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`px-4 py-2 mx-2 border rounded ${currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-plum text-white"
                    }`}
                >
                  Previous
                </button>
                <span className="text-lg font-semibold mx-4">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
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
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryProducts;
