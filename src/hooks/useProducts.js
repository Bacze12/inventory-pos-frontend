import { useState, useEffect } from 'react';
import { fetchProducts, addProduct } from '../api/products';


export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const data = await fetchProducts(token);
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (query) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [query, products]);

  const handleAddProduct = async (product) => {
    const newProduct = await addProduct(product);
    setProducts([...products, newProduct]);
    setFilteredProducts([...products, newProduct]);
  };

  return {
    products,
    filteredProducts,
    query,
    setQuery,
    name,
    setName,
    price,
    setPrice,
    handleAddProduct,
  };
};

export default useProducts;
