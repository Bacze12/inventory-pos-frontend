import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../../api';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.log('Error fetching products:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productItems = useMemo(() => {
    return products.map((product) => (
      <div key={product.id} className="border rounded-lg p-4 m-2 shadow-sm">
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="text-gray-600">{product.price}</p>
      </div>
    ));
  }, [products]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      {productItems}
    </div>
  );
};

export default React.memo(ProductList);
