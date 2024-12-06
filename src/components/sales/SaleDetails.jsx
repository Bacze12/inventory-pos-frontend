import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const SaleDetails = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await API.get(`/sales/${id}`);
        setSale(response.data);
      } catch (err) {
        console.log(
          err.response?.data?.message || 'Failed to fetch sale details.'
        );
      }
    };

    fetchSale();
  }, [id]);

  if (!sale) return <p>Loading...</p>;

  return (
    <div>
      <h1>Sale Details</h1>
      <p>Product ID: {sale.productId}</p>
      <p>Quantity: {sale.quantity}</p>
      <p>Date: {sale.date}</p>
    </div>
  );
};

export default SaleDetails;
