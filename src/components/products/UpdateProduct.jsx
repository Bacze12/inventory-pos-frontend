import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setName(response.data.name);
        setPrice(response.data.price);
      } catch (err) {
        console.log('Failed to load product details.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await API.put(`/products/${id}`, { name, price: parseFloat(price) });
      console.log('Product updated successfully!');
    } catch (err) {
      console.log('Failed to update product.');
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
      <button onClick={handleUpdate}>
        Update Product
      </button>
    </div>
  );
};

export default UpdateProduct;
