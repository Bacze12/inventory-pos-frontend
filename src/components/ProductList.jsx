import React, { useEffect, useState, useMemo, useCallback } from 'react';
import API from '../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productItems = useMemo(() => {
    return products.map(product => (
      <div 
        key={product.id} 
        className="border rounded-lg p-4 m-2 shadow-sm"
      >
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="text-gray-600">{product.price}</p>
      </div>
    ));
  }, [products]);

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />


    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      {productItems}
    </div>
  );
};

export default React.memo(ProductList);