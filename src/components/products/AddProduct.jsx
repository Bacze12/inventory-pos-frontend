import React, { useState } from 'react';
import API from '../../api';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async () => {
    try {
      // Validaciones básicas
      if (!name.trim() || !price.trim()) {
        console.log('Please fill in all fields.');
        return;
      }

      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        console.log('Please enter a valid price greater than 0.');
        return;
      }

      // Enviar solicitud al backend
      await API.post('/products', {
        name,
        price: numericPrice,
      });

      // Limpiar campos después del éxito
      setName('');
      setPrice('');
      console.log('Product added successfully!');
    } catch (error) {
      console.log(
        'Error adding product:',
        error?.response?.data || error.message
      );
      console.log(
        error?.response?.data?.message ||
          'Failed to add product. Please try again.'
      );
    }
  };

  return (
    <div className="p-4">
      <input
        className="w-full border rounded p-2 mb-4"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full border rounded p-2 mb-4"
        placeholder="Product Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Add Product
      </button>
    </div>
  );
};

export default AddProduct;
