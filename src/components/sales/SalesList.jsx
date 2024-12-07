import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react';
import API from '../../api/api';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      const response = await API.get('/sales');
      setSales(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener la lista de ventas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const salesItems = useMemo(() => {
    return sales.map((sale) => (
      <Box
        key={sale.id}
        borderWidth="1px"
        borderRadius="md"
        p={4}
        bg="white"
        shadow="sm"
        mb={4}
      >
        <Text fontSize="lg">
          <strong>ID del Producto:</strong> {sale.productId}
        </Text>
        <Text fontSize="lg">
          <strong>Cantidad:</strong> {sale.quantity}
        </Text>
        <Text fontSize="lg">
          <strong>Fecha:</strong> {new Date(sale.date).toLocaleString()}
        </Text>
        <Divider mt={2} />
      </Box>
    ));
  }, [sales]);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  if (sales.length === 0) {
    return (
      <Center h="100vh">
        <Alert status="info">
          <AlertIcon />
          No hay ventas registradas.
        </Alert>
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Lista de Ventas
      </Heading>
      <VStack align="stretch">{salesItems}</VStack>
    </Box>
  );
};

export default React.memo(SalesList);
