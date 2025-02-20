import API from './api';

// Login
export const login = async (data) => {
  const res = await API.post('/auth/login', data);
  return res.data;
};

// logout
export const logout = async () => {
  const res = await API.post('/auth/logout');
  return res.data;
};

// refresh token
export const refreshToken = async () => {
  const res = await API.post('/auth/refresh');
  return res.data;
};