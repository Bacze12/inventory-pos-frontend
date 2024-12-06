import API from './api';
import { useQuery } from '@tanstack/react-query';

// Obtener todas las ventas con cacheo
export const useSales = () => {
  return useQuery('sales', async () => {
    const { data } = await API.get('/sales');
    return data;
  });
};

// Obtener detalles de una venta específica con cacheo
export const useSaleDetails = (id) => {
  return useQuery(['sale', id], async () => {
    const { data } = await API.get(`/sales/${id}`);
    return data;
  });
};
