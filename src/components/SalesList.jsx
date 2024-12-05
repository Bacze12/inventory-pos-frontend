import React, { useEffect, useState, useMemo, useCallback } from 'react';
import API from '../api';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      const response = await API.get('/sales');
      setSales(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sales.');
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const salesItems = useMemo(() => {
    return sales.map((sale) => (
      <li key={sale.id}>
        Product ID: {sale.productId}, Quantity: {sale.quantity}, Date: {sale.date}
        {' '}
      </li>
    ));
  }, [sales]);

  if (error) return <p>{error}</p>;
  if (sales.length === 0) return <p>No sales recorded.</p>;

  return <ul>{salesItems}</ul>;
};

export default React.memo(SalesList);
