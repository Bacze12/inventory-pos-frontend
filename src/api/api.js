import axios from 'axios';

// Configuración base de Axios
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  withCredentials: false, // Cambia a true si usas sesiones
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;