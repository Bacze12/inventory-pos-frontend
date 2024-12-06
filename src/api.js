import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Configuración de Axios
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  withCredentials: false, // change to false if not using sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

// Función para obtener productos con caching
export const useProducts = () => {
  return useQuery('products', async () => {
    const { data } = await API.get('/products');
    return data;
  });
};

// Función para obtener detalles de un producto con caching
export const useProductDetails = (id) => {
  return useQuery(['product', id], async () => {
    const { data } = await API.get(`/products/${id}`);
    return data;
  });
};

// Función para obtener ventas con caching
export const useSales = () => {
  return useQuery('sales', async () => {
    const { data } = await API.get('/sales');
    return data;
  });
};

// Función para obtener detalles de una venta con caching
export const useSaleDetails = (id) => {
  return useQuery(['sale', id], async () => {
    const { data } = await API.get(`/sales/${id}`);
    return data;
  });
};

export default API;
