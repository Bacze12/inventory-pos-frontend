import React, { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import useSales from '../../hooks/useSales';

const SaleDetails = ({ saleId }) => {
  const { sales, getSales } = useSales();
  const sale = sales.find((s) => s.id === saleId);

  useEffect(() => {
    if (!sales.length) {
      getSales();
    }
  }, [sales, getSales]);

  if (!sale) {
    return <Text>Cargando detalles de la venta...</Text>;
  }

  return (
    <Box>
      <Text fontWeight="bold">Cliente: {sale.customer}</Text>
      <Text>Total: ${sale.total}</Text>
      <Text>Fecha: {new Date(sale.date).toLocaleDateString()}</Text>
    </Box>
  );
};

export default SaleDetails;
