import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UpdateProduct from './UpdateProduct';
import API from '../api';

jest.mock('../api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
}));

describe('UpdateProduct Component', () => {
  const mockProduct = { id: '1', name: 'Test Product', price: 100 };

  beforeEach(() => {
    API.get.mockResolvedValue({ data: mockProduct });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('displays error message when PUT endpoint is missing', async () => {
    API.put.mockRejectedValueOnce({
      response: { status: 404, data: 'PUT endpoint not found' },
    });

    render(
      <MemoryRouter initialEntries={['/products/1/edit']}>
        <Routes>
          <Route path="/products/:id/edit" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );

    const updateButton = screen.getByText('Update Product');
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByText('Error: PUT endpoint not found')).toBeInTheDocument();
    });
  });

  test('renders UpdateProduct component', async () => {
    render(
      <MemoryRouter initialEntries={['/products/1/edit']}>
        <Routes>
          <Route path="/products/:id/edit" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Product Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Product Price')).toBeInTheDocument();
    expect(screen.getByText('Update Product')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockProduct.name)).toBeInTheDocument();
    });

    expect(
      screen.getByDisplayValue(mockProduct.price.toString())
    ).toBeInTheDocument();
  });

  test('handles user input', async () => {
    render(
      <MemoryRouter initialEntries={['/products/1/edit']}>
        <Routes>
          <Route path="/products/:id/edit" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );

    const nameInput = await screen.findByPlaceholderText('Product Name');
    const priceInput = await screen.findByPlaceholderText('Product Price');

    fireEvent.change(nameInput, { target: { value: 'Updated Product' } });
    fireEvent.change(priceInput, { target: { value: '200' } });

    expect(nameInput.value).toBe('Updated Product');
    expect(priceInput.value).toBe('200');
  });

  test('displays success message on successful product update', async () => {
    API.put.mockResolvedValueOnce({
      data: { ...mockProduct, name: 'Updated Product', price: 200 },
    });

    render(
      <MemoryRouter initialEntries={['/products/1/edit']}>
        <Routes>
          <Route path="/products/:id/edit" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );

    const nameInput = await screen.findByPlaceholderText('Product Name');
    const priceInput = await screen.findByPlaceholderText('Product Price');
    const updateButton = screen.getByText('Update Product');

    fireEvent.change(nameInput, { target: { value: 'Updated Product' } });
    fireEvent.change(priceInput, { target: { value: '200' } });
    fireEvent.click(updateButton);

    expect(
      await screen.findByText('Product updated successfully!')
    ).toBeInTheDocument();
  });

  test('displays error message on failed product update', async () => {
    API.put.mockRejectedValueOnce(new Error('Failed to update product.'));

    render(
      <MemoryRouter initialEntries={['/products/1/edit']}>
        <Routes>
          <Route path="/products/:id/edit" element={<UpdateProduct />} />
        </Routes>
      </MemoryRouter>
    );

    const nameInput = await screen.findByPlaceholderText('Product Name');
    const priceInput = await screen.findByPlaceholderText('Product Price');
    const updateButton = screen.getByText('Update Product');

    fireEvent.change(nameInput, { target: { value: 'Updated Product' } });
    fireEvent.change(priceInput, { target: { value: '200' } });
    fireEvent.click(updateButton);

    expect(
      await screen.findByText('Failed to update product.')
    ).toBeInTheDocument();
  });
});
