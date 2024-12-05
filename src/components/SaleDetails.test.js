import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SaleDetails from './SaleDetails';
import API from '../api';

jest.mock('../api');

describe('SaleDetails Component', () => {
  const mockSale = {
    id: '1',
    productId: '123',
    quantity: 10,
    date: '2023-01-01',
  };

  beforeEach(() => {
    API.get.mockResolvedValue({ data: mockSale });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SaleDetails component', async () => {
    render(
      <MemoryRouter initialEntries={['/sales/1']}>
        <Routes>
          <Route path="/sales/:id" element={<SaleDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Sale Details')).toBeInTheDocument();
    });

    expect(
      screen.getByText(`Product ID: ${mockSale.productId}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Quantity: ${mockSale.quantity}`)
    ).toBeInTheDocument();
    expect(screen.getByText(`Date: ${mockSale.date}`)).toBeInTheDocument();
  });

  test('displays error message on failed fetch', async () => {
    API.get.mockRejectedValueOnce(new Error('Failed to fetch sale details.'));

    render(
      <MemoryRouter initialEntries={['/sales/1']}>
        <Routes>
          <Route path="/sales/:id" element={<SaleDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch sale details.')
      ).toBeInTheDocument();
    });
  });
});
