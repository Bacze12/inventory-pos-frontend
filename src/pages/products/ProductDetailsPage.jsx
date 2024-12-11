import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import { CollapsibleSidebar } from '../../components/layout/CollapsibleSidebar';
import { Navbar } from '../../components/layout/Navbar';
import { useParams } from 'react-router-dom';
import API from '../../api/api';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '240px' : '60px'} p={4}>
          <Heading size="lg" mb={4}>Detalles del Producto</Heading>
          <Box p={6} bg="white" borderRadius="md" shadow="sm">
            <Heading size="lg" mb={4}>
              {product.name}
            </Heading>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              Precio: ${product.price.toFixed(2)}
            </Text>
            <Text fontSize="md" mb={2}>
              Descripción: {product.description}
            </Text>
            <Text fontSize="md" mb={2}>
              Categoría: {product.category}
            </Text>
            <Text fontSize="md" mb={2}>
              Stock: {product.stock}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductDetailsPage;
