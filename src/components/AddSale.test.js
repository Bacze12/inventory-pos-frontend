import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddSale from './AddSale';

describe('AddSale Component', () => {
  test('renders AddSale component', () => {
    render(<AddSale />);
    expect(screen.getByPlaceholderText('Product ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Quantity')).toBeInTheDocument();
    expect(screen.getByText('Add Sale')).toBeInTheDocument();
  });

  test('handles user input', () => {
    render(<AddSale />);
    const productIdInput = screen.getByPlaceholderText('Product ID');
    const quantityInput = screen.getByPlaceholderText('Quantity');

    fireEvent.change(productIdInput, { target: { value: '123' } });
    fireEvent.change(quantityInput, { target: { value: '10' } });

    expect(productIdInput.value).toBe('123');
    expect(quantityInput.value).toBe('10');
  });

  test('displays success message on successful sale recording', async () => {
    render(<AddSale />);
    const productIdInput = screen.getByPlaceholderText('Product ID');
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const addButton = screen.getByText('Add Sale');

    fireEvent.change(productIdInput, { target: { value: '123' } });
    fireEvent.change(quantityInput, { target: { value: '10' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Sale recorded successfully!')).toBeInTheDocument();
  });

  test('displays error message on failed sale recording', async () => {
    render(<AddSale />);
    const productIdInput = screen.getByPlaceholderText('Product ID');
    const quantityInput = screen.getByPlaceholderText('Quantity');
    const addButton = screen.getByText('Add Sale');

    fireEvent.change(productIdInput, { target: { value: '123' } });
    fireEvent.change(quantityInput, { target: { value: '10' } });
    fireEvent.click(addButton);

    expect(await screen.findByText('Failed to record sale.')).toBeInTheDocument();
  });
});
