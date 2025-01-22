import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://pos-backend-production-e60d.up.railway.app/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor para agregar el token de autenticación
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
