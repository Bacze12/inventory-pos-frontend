import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/dom';
import DeleteProduct from './DeleteProduct';

describe('DeleteProduct Component', () => {
  test('renders DeleteProduct component', () => {
    render(<DeleteProduct id="1" />);
    expect(screen.getByText('Delete Product')).toBeInTheDocument();
  });

  test('calls onDelete callback on successful deletion', async () => {
    const onDeleteMock = jest.fn();
    render(<DeleteProduct id="1" onDelete={onDeleteMock} />);
    const deleteButton = screen.getByText('Delete Product');

    fireEvent.click(deleteButton);

    expect(
      await screen.findByText('Product deleted successfully!')
    ).toBeInTheDocument();
    expect(onDeleteMock).toHaveBeenCalled();
  });

  test('displays error message on failed deletion', async () => {
    render(<DeleteProduct id="1" />);
    const deleteButton = screen.getByText('Delete Product');

    fireEvent.click(deleteButton);

    expect(
      await screen.findByText('Failed to delete product.')
    ).toBeInTheDocument();
  });
  test('displays error message when DELETE endpoint is missing', async () => {
    API.delete.mockRejectedValueOnce({
      response: { status: 404, data: 'DELETE endpoint not found' },
    });
  
    render(<DeleteProduct id="1" />);
    const deleteButton = screen.getByText('Delete Product');
    fireEvent.click(deleteButton);
  
    await waitFor(() => {
      expect(screen.getByText('Error: DELETE endpoint not found')).toBeInTheDocument();
    });
  });
  
});
