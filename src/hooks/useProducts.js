import { useState, useEffect } from 'react';
import { fetchProducts, addProduct } from '../api/products';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const data = await fetchProducts(token);
      setProducts(data);
    };
    fetchData();
  }, []);

  const handleAddProduct = async () => {
    const token = localStorage.getItem('token');
    if (await addProduct(token, { name, price: parseFloat(price) })) {
      setName('');
      setPrice('');
      // Refresh products
      const data = await fetchProducts(token);
      setProducts(data);
    }
  };

  return { products, name, price, setName, setPrice, handleAddProduct };
};
