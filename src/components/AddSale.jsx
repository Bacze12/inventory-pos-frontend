import React, { useState } from 'react';
import API from '../api';

const AddSale = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await API.post('/sales', { productId, quantity: parseInt(quantity) });
      alert('Sale recorded successfully!');
    } catch (err) {
      alert('Failed to record sale.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        placeholder="Product ID"
      />
      <input
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Add Sale'}
      </button>
    </div>
  );
};

export default AddSale;
