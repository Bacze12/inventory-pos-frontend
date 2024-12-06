import API from './api';
import { useQuery } from '@tanstack/react-query';

// Obtener todos los productos con cacheo
export const useProducts = () => {
  return useQuery('products', async () => {
    const { data } = await API.get('/products');
    return data;
  });
};

// Obtener detalles de un producto específico con cacheo
export const useProductDetails = (id) => {
  return useQuery(['product', id], async () => {
    const { data } = await API.get(`/products/${id}`);
    return data;
  });
};