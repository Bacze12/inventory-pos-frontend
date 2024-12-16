import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  Center,
  Alert,
  IconButton,
  AlertIcon,
  Divider,
  Button,
  SimpleGrid,
  Stat,
  useColorModeValue,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
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
          <Flex align="center" mb={4}>
            <Heading as="h1" size="lg" >
              <Text as="span">{product.name || 'Nombre no disponible'}</Text>
            </Heading>
            <Button variant="outline" ml="auto">
              Editar
            </Button>
            <Button colorScheme="red" ml={4}>
              Eliminar
            </Button>
          </Flex>
            <SimpleGrid columns={[1, 2]} spacing={8} mb={6}>
                <Stat bg={bgColor} p={4} shadow="sm" borderRadius="lg">
                  <Text fontSize="lg" fontWeight="bold">
                    Detalles del Producto
                  </Text>
                  <Divider my={4} />
                  <Text fontSize="lg" fontWeight="bold" color="gray.600" mb={3}>
                    Codigo de Barra: <Text as="span" color="blue.500">{product.sku}</Text>
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600" mb={3}>
                    Categoría: <Text as="span" color="blue.500">{product.Category?.name || 'No disponible'}</Text>
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.600" mb={3}>
                    Proveedor: <Text as="span" color="blue.500">{product.Supplier?.name || 'No disponible'}</Text>
                  </Text>
                </Stat>
              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg">
                <Heading size="md" color="gray.600">
                  Stock
                </Heading>
                <Divider my={4} />
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  Stock actual: <Text as="span" color="blue.500">{product.stock}</Text>
                </Text>
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  Última Reposicion: <Text as="span" color="blue.500">{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'No disponible'}</Text>
                </Text>
              </Stat>
            </SimpleGrid>
            <SimpleGrid columns={[1, 2]} spacing={8}>
              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg">
                <Heading size="md" color="gray.600">
                  Precios
                </Heading>
                <Divider my={4} />
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  Precio de Compra: <Text as="span" color="blue.500">${product.purchasePrice.toLocaleString('es-CL')}</Text>
                </Text>
                <Text fontSize="lg" fontWeight="bold" mb={3}>
                  Precio Final: <Text as="span" color="blue.500">${product.finalPrice.toLocaleString('es-CL')}</Text>
                </Text>
              </Stat>
            </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductDetailsPage;
