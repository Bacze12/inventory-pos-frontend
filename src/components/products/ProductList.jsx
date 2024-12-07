import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Heading, Text, VStack, Spinner, Center, Alert, AlertIcon } from '@chakra-ui/react';
import API from '../../api/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (err) {
      setError('Error al obtener la lista de productos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productItems = useMemo(() => {
    return products.map((product) => (
      <Box
        key={product.id}
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        shadow="sm"
        mb={4}
        bg="white"
      >
        <Heading size="md">{product.name}</Heading>
        <Text color="gray.500">Precio: ${product.price.toFixed(2)}</Text>
      </Box>
    ));
  }, [products]);

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
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Lista de Productos
      </Heading>
      <VStack align="stretch">{productItems}</VStack>
    </Box>
  );
};

export default React.memo(ProductList);
