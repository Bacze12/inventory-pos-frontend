import React from 'react';
import API from '../api';

const DeleteProduct = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await API.delete(`/products/${id}`);
      alert('Product deleted successfully!');
      if (onDelete) onDelete();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete Product
    </button>
  );
};

export default DeleteProduct;
