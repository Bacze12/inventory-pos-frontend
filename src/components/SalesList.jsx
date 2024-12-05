import React, { useEffect, useState } from 'react';
import API from '../api';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await API.get('/sales');
        setSales(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sales.');
      }
    };

    fetchSales();
  }, []);

  if (error) return <p>{error}</p>;
  if (sales.length === 0) return <p>No sales recorded.</p>;

  return (
    <ul>
      {sales.map((sale) => (
        <li key={sale.id}>
          Product ID: {sale.productId}, Quantity: {sale.quantity}, Date: {sale.date}
        </li>
      ))}
    </ul>
  );
};

export default SalesList;
