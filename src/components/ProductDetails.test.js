import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import API from '../api';

jest.mock('../api');

describe('ProductDetails Component', () => {
  const mockProduct = { id: '1', name: 'Test Product', price: 100 };

  beforeEach(() => {
    API.get.mockResolvedValue({ data: mockProduct });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ProductDetails component', async () => {
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText(`Price: $${mockProduct.price}`)).toBeInTheDocument();
    });
  });

  test('displays error message on failed fetch', async () => {
    API.get.mockRejectedValueOnce(new Error('Failed to fetch product details.'));

    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch product details.')).toBeInTheDocument();
    });
  });
});
