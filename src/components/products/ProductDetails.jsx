import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner, Center, Alert, AlertIcon } from '@chakra-ui/react';
import API from '../../api/api';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo obtener la información del producto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
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
        {product.name}
      </Heading>
      <Text fontSize="xl" fontWeight="bold">
        Precio: ${product.price.toFixed(2)}
      </Text>
    </Box>
  );
};

export default ProductDetails;
