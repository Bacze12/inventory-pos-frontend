import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SalesList from './SalesList';
import API from '../api';

jest.mock('../api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn()
}));

describe('SalesList Component', () => {
  const mockSales = [
    { id: '1', productId: '101', quantity: 2, date: '2023-01-01' },
    { id: '2', productId: '102', quantity: 1, date: '2023-01-02' },
  ];

  beforeEach(() => {
    API.get.mockResolvedValue({ data: mockSales });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SalesList component', async () => {
    render(<SalesList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      mockSales.forEach((sale) => {
        expect(
          screen.getByText(`Product ID: ${sale.productId}`)
        ).toBeInTheDocument();
        expect(
          screen.getByText(`Quantity: ${sale.quantity}`)
        ).toBeInTheDocument();
        expect(screen.getByText(`Date: ${sale.date}`)).toBeInTheDocument();
      });
    });
  });
  test('displays error message when endpoint does not exist', async () => {
    API.get.mockRejectedValueOnce({
      response: { status: 404, data: 'Endpoint not found' },
    });

    render(<SalesList />);

    await waitFor(() => {
      expect(screen.getByText('Error: Endpoint not found')).toBeInTheDocument();
    });
  });

  test('displays error message on failed fetch', async () => {
    API.get.mockRejectedValueOnce(new Error('Failed to fetch sales.'));

    render(<SalesList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch sales.')).toBeInTheDocument();
    });
  });

  test('displays no sales message when there are no sales', async () => {
    API.get.mockResolvedValueOnce({ data: [] });

    render(<SalesList />);

    await waitFor(() => {
      expect(screen.getByText('No sales recorded.')).toBeInTheDocument();
    });
  });
});
