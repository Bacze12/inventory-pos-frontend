import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductList from './ProductList';
import API from '../api';

jest.mock('../api');

describe('ProductList Component', () => {
  const mockProducts = [
    { id: '1', name: 'Product 1', price: 10 },
    { id: '2', name: 'Product 2', price: 20 },
  ];

  beforeEach(() => {
    API.get.mockResolvedValue({ data: mockProducts });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ProductList component', async () => {
    render(<ProductList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Product List')).toBeInTheDocument();
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
        expect(screen.getByText(product.price)).toBeInTheDocument();
      });
    });
  });

  test('displays error message on failed fetch', async () => {
    API.get.mockRejectedValueOnce(new Error('Failed to fetch products.'));

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText('Error fetching products')).toBeInTheDocument();
    });
  });
});
