import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/dom';
import AddProduct from './AddProduct';

describe('AddProduct Component', () => {
  test('renders AddProduct component', () => {
    render(<AddProduct />);
    expect(screen.getByPlaceholderText('Product Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Product Price')).toBeInTheDocument();
    expect(screen.getByText('Add Product')).toBeInTheDocument();
  });

  test('handles user input', () => {
    render(<AddProduct />);
    const nameInput = screen.getByPlaceholderText('Product Name');
    const priceInput = screen.getByPlaceholderText('Product Price');

    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '10' } });

    expect(nameInput.value).toBe('Test Product');
    expect(priceInput.value).toBe('10');
  });

  test('displays error message for empty fields', () => {
    render(<AddProduct />);
    const addButton = screen.getByText('Add Product');

    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith('Please fill in all fields.');
  });

  test('displays error message for invalid price', () => {
    render(<AddProduct />);
    const nameInput = screen.getByPlaceholderText('Product Name');
    const priceInput = screen.getByPlaceholderText('Product Price');
    const addButton = screen.getByText('Add Product');

    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '-10' } });
    fireEvent.click(addButton);

    expect(window.alert).toHaveBeenCalledWith(
      'Please enter a valid price greater than 0.'
    );
  });

  test('displays success message on successful product addition', async () => {
    render(<AddProduct />);
    const nameInput = screen.getByPlaceholderText('Product Name');
    const priceInput = screen.getByPlaceholderText('Product Price');
    const addButton = screen.getByText('Add Product');

    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '10' } });
    fireEvent.click(addButton);

    expect(
      await screen.findByText('Product added successfully!')
    ).toBeInTheDocument();
  });

  test('displays error message on failed product addition', async () => {
    render(<AddProduct />);
    const nameInput = screen.getByPlaceholderText('Product Name');
    const priceInput = screen.getByPlaceholderText('Product Price');
    const addButton = screen.getByText('Add Product');

    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '10' } });
    fireEvent.click(addButton);

    expect(
      await screen.findByText('Failed to add product. Please try again.')
    ).toBeInTheDocument();
  });
  test('displays error message when POST endpoint is missing', async () => {
    API.post.mockRejectedValueOnce({
      response: { status: 404, data: 'POST endpoint not found' },
    });
  
    render(<AddProduct />);
    const addButton = screen.getByText('Add Product');
    fireEvent.click(addButton);
  
    await waitFor(() => {
      expect(screen.getByText('Error: POST endpoint not found')).toBeInTheDocument();
    });
  });
});
