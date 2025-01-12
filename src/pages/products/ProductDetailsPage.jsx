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
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';
import { useParams } from 'react-router-dom';
import API from '../../api/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  const priceHistoryData = {
    labels: product?.priceHistory?.map(history => new Date(history.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Precio de Compra',
        data: product?.priceHistory?.map(history => history.purchasePrice) || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Precio de Venta',
        data: product?.priceHistory?.map(history => history.finalPrice) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
    },
  };

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
            <SimpleGrid columns={[1, 2]} spacing={100} mb={3}>
              <SimpleGrid columns={[1, 2]} spacing={8} mb={6}>
                <Stat bg={bgColor} p={4} shadow="sm" borderRadius="lg" textAlign="center">
                  <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Codigo de Barra</StatLabel>
                  <StatNumber as="span" color="blue.500">{product.sku}</StatNumber>
                </Stat>
                <Stat bg={bgColor} p={4} shadow="sm" borderRadius="lg" textAlign="center">
                  <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Categoría</StatLabel>
                  <StatNumber as="span" color="blue.500">{product.Category?.name || 'No disponible'}</StatNumber>
                </Stat>
              </SimpleGrid>
              <SimpleGrid columns={[1, 2]} spacing={8} mb={6}>
                <Stat bg={bgColor} p={6} shadow="sm" borderRadius="lg" textAlign="center">
                  <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Stock actual</StatLabel>
                  <StatNumber as="span" color="blue.500">{product.stock} Unidades</StatNumber>
                </Stat>
                <Stat spacing={15} bg={bgColor} p={4} shadow="sm" borderRadius="lg" textAlign="center">
                  <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Ultima Modificación</StatLabel>
                  <StatNumber as="span" color="blue.500">{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'No disponible'}</StatNumber>
                </Stat>
              </SimpleGrid>
            </SimpleGrid>
            <SimpleGrid columns={[1, 2, 3, 4, 5]} spacing={4} mb={6}>
              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg"  >
                <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Precio de Compra</StatLabel>
                <StatNumber as="span" color="blue.500">${product.purchasePrice.toLocaleString('es-CL')}</StatNumber>
              </Stat>
              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg" textAlign="center">
                <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Precio Final</StatLabel>
                <StatNumber as="span" color="blue.500">${product.finalPrice.toLocaleString('es-CL')}</StatNumber>
              </Stat>

              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg" textAlign="center">
                <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Monto Margen</StatLabel>
                <StatNumber as="span" color="green.500">${(product.finalPrice - product.purchasePrice).toLocaleString('es-CL') }</StatNumber>
              </Stat>

              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg" textAlign="center">
                <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Margen A.I</StatLabel>
                <StatNumber as="span" color="green.500">{new Intl.NumberFormat('es-CL', { style: 'percent' }).format(product.marginPercent/100)}</StatNumber>
              </Stat>
              
              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg" textAlign="center">
                <StatLabel fontSize="lg" fontWeight="bold" mb={3}>Margen D.I</StatLabel>
                <StatNumber as="span" color="green.500">{new Intl.NumberFormat('es-CL', { style: 'percent' }).format((product.marginPercent - 19) / 100)}</StatNumber>
              </Stat>
            </SimpleGrid>
            <SimpleGrid columns={[1, 2]} spacing={8} mb={6}>
              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg">
                <Heading size="md" textAlign="center">
                  Historial de Precios
                </Heading>
                <Line options={options} data={priceHistoryData} />
              </Stat>
              <Stat spacing={4} bg={bgColor} p={4} shadow="sm" borderRadius="lg">
                <Heading size="md">
                  Tabla con movimientos del producto
                </Heading>
                <Divider my={4} />
                
              </Stat>
            </SimpleGrid>
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductDetailsPage;