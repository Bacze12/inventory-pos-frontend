import React, { useState } from 'react';
import api from '../../api';

const AddSale = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async () => {
    try {
      await API.post('/sales', { productId, quantity: parseInt(quantity) });
      console.log('Sale recorded successfully!');
    } catch (err) {
      console.log('Failed to record sale.');
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
      <button onClick={handleSubmit}>
        Add Sale
      </button>
    </div>
  );
};

export default AddSale;
