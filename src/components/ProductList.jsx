import React, { useEffect, useState } from 'react';
import API from '../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      {products.map(product => (
        <div 
          key={product.id} 
          className="border rounded-lg p-4 m-2 shadow-sm"
        >
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p className="text-gray-600">{product.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;