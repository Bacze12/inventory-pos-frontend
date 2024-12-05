import React, { useState } from 'react';
import API from '../api';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      // Validaciones básicas
      if (!name.trim() || !price.trim()) {
        alert('Please fill in all fields.');
        return;
      }

      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        alert('Please enter a valid price greater than 0.');
        return;
      }

      setIsLoading(true); // Mostrar estado de carga

      // Enviar solicitud al backend
      await API.post('/products', {
        name,
        price: numericPrice,
      });

      // Limpiar campos después del éxito
      setName('');
      setPrice('');
      alert('Product added successfully!');
    } catch (error) {
      console.error(
        'Error adding product:',
        error?.response?.data || error.message
      );
      alert(
        error?.response?.data?.message ||
          'Failed to add product. Please try again.'
      );
    } finally {
      setIsLoading(false); // Restablecer estado de carga
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
        className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
          isLoading ? 'opacity-50' : ''
        }`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Adding...' : 'Add Product'}
      </button>
    </div>
  );
};

export default AddProduct;
