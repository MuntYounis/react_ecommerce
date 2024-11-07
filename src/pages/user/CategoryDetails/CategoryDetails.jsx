import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function CategoryDetails() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { categoryId } = useParams();

  const getProducts = async () => {
    try {
      const { data } = await axios.get(`https://ecommerce-node4.onrender.com/products/category/${categoryId}`);
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getProducts();
  }, [categoryId]);

  return (
    <section className="container mx-auto py-8 max-w-7xl mt-20">
      <h1 className="text-2xl font-bold text-center mb-8">Category Products</h1>
      {loading ? (
        <div className="text-center min-h-[500px]">Loading...</div> 
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col justify-between border border-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={product.mainImage.secure_url}
                alt={product.name}
                className="w-40 mx-auto"
              />
              <div className="px-4 flex-1">
                <h2 className="text-base">{product.name}</h2>
              </div>
              <div className="p-4 flex justify-end">
                <Link
                  to={`/product/${product._id}`}
                  className="text-sm bg-blue-500 text-white py-1.5 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
