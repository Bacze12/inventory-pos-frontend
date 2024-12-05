import axios from 'axios';

// Configuración de Axios
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // Cambia la URL al backend desplegado
});

export default API;
