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
  Divider,
  Button,
  SimpleGrid,
  Stack,
  useColorModeValue,
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

  const bgColor = useColorModeValue('white', 'gray.800');

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
    <Box bg="gray.50" minH="100vh">
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '240px' : '60px'} p={6}>
          <Heading size="lg" mb={6}>
            Detalles del Producto
          </Heading>
          <Box p={8} bg={bgColor} borderRadius="lg" shadow="md">
            <SimpleGrid columns={[1, 2]} spacing={8} mb={6}>
              <Stack spacing={4}>
                <Heading size="md" color="gray.600">
                  Información Básica
                </Heading>
                <Text fontSize="lg" fontWeight="bold">
                  Nombre: <Text as="span" color="blue.500">{product.name || 'Nombre no disponible'}</Text>
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Categoría: <Text as="span" color="blue.500">{product.Category?.name || 'No disponible'}</Text>
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Proveedor: <Text as="span" color="blue.500">{product.Supplier?.name || 'No disponible'}</Text>
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Activo: <Text as="span" color={product.isActive ? 'green.500' : 'red.500'}>{product.isActive ? 'Sí' : 'No'}</Text>
                </Text>
              </Stack>
              <Stack spacing={4}>
                <Heading size="md" color="gray.600">
                  Precios
                </Heading>
                <Text fontSize="lg" fontWeight="bold">
                  Precio de Compra: <Text as="span" color="blue.500">${product.purchasePrice}</Text>
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Precio Final: <Text as="span" color="blue.500">${product.finalPrice}</Text>
                </Text>
              </Stack>
            </SimpleGrid>
            <Divider mb={6} />
            <SimpleGrid columns={[1, 2]} spacing={8}>
              <Stack spacing={4}>
                <Heading size="md" color="gray.600">
                  Información Temporal
                </Heading>
                <Text fontSize="lg" fontWeight="bold">
                  Fecha de Creación: <Text as="span" color="blue.500">{product.createdAt ? new Date(product.createdAt).toLocaleString() : 'No disponible'}</Text>
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  Última Actualización: <Text as="span" color="blue.500">{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'No disponible'}</Text>
                </Text>
              </Stack>
              <Stack spacing={4}>
                <Heading size="md" color="gray.600">
                  Acciones
                </Heading>
                <Button colorScheme="blue" size="lg" w="full">
                  Editar Producto
                </Button>
                <Button colorScheme="red" size="lg" w="full">
                  Eliminar Producto
                </Button>
              </Stack>
            </SimpleGrid>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductDetailsPage;
