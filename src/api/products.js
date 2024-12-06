const API_BASE = 'http://localhost:3009/api';

export const fetchProducts = async (token) => {
  const response = await fetch(`${API_BASE}/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const addProduct = async (token, product) => {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return response.ok;
};
