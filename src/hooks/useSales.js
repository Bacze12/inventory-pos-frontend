import { useState, useEffect } from 'react';
import { fetchSales, addSale } from '../api/sales';

/**
 * Hook personalizado para manejar las ventas.
 */
const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene todas las ventas del servidor.
   */
  const getSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const data = await fetchSales(token);
      setSales(data);
    } catch (err) {
      setError('Error al obtener las ventas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Agrega una nueva venta al servidor.
   * @param {Object} sale - Los datos de la venta a agregar.
   * @returns {boolean} `true` si la venta se agregó correctamente, `false` en caso de error.
   */
  const createSale = async (sale) => {
    try {
      const token = localStorage.getItem('token');
      const success = await addSale(token, sale);
      if (success) {
        await getSales(); // Actualiza la lista de ventas
        return true;
      }
      return false;
    } catch (err) {
      setError('Error al agregar la venta.');
      return false;
    }
  };

  useEffect(() => {
    getSales();
  }, []);

  return { sales, loading, error, getSales, createSale };
};

export default useSales;
