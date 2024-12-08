import { useState } from 'react';

/**
 * Hook personalizado para realizar solicitudes HTTP.
 * @param {string} baseUrl - La URL base para las solicitudes.
 */
const useFetch = (baseUrl) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Realiza una solicitud HTTP.
   * @param {string} endpoint - El endpoint relativo a la URL base.
   * @param {string} method - El método HTTP (`GET`, `POST`, `PUT`, `DELETE`).
   * @param {Object} [body] - Los datos a enviar en el cuerpo de la solicitud.
   * @param {Object} [headers] - Los encabezados de la solicitud.
   * @returns {Promise<Object>} La respuesta de la solicitud.
   */
  const request = async (endpoint, method = 'GET', body = null, headers = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (body) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

export default useFetch;
