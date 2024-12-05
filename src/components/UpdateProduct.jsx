import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setName(response.data.name);
        setPrice(response.data.price);
      } catch (err) {
        alert('Failed to load product details.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await API.put(`/products/${id}`, { name, price: parseFloat(price) });
      alert('Product updated successfully!');
    } catch (err) {
      alert('Failed to update product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
      />
      <input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Product Price"
      />
      <button onClick={handleUpdate} disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Product'}
      </button>
    </div>
  );
};

export default UpdateProduct;
