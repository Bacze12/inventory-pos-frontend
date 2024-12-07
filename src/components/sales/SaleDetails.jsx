import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import API from '../../api/api';

const SaleDetails = () => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await API.get(`/sales/${id}`);
        setSale(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Error al cargar los detalles de la venta.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSale();
  }, [id]);

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

  return (
    <Box p={6} bg="white" borderRadius="md" shadow="sm">
      <Heading size="lg" mb={4}>
        Detalles de la Venta
      </Heading>
      <Text fontSize="lg">
        <strong>ID del Producto:</strong> {sale.productId}
      </Text>
      <Text fontSize="lg">
        <strong>Cantidad:</strong> {sale.quantity}
      </Text>
      <Text fontSize="lg">
        <strong>Fecha:</strong> {new Date(sale.date).toLocaleString()}
      </Text>
    </Box>
  );
};

export default SaleDetails;
