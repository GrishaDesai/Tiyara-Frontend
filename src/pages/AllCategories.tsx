import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { fetchCategories } from '../apis/categories';
import type { Result } from '../types/result'; 
import type { IndividualCategory } from "../types/individualCategory";


const AllCategories: FC = () => {
  const [products, setProducts] = useState<IndividualCategory[]>([]);
  const [isLoading, setIsLoading] = useState < boolean > (false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response: Result = await fetchCategories();
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

  // Render loader if data is not yet available
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 mt-12 flex justify-center">Categories</h2>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((item, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(`/cat_product/${item.category}`)}
          >
            <img
              src={item.image}
              alt={item.category}
              className="w-full h-auto object-cover"
            />
            <div className="p-4 text-center bg-white">
              <h3 className="text-lg font-semibold text-gray-800">{item.category}</h3>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AllCategories;