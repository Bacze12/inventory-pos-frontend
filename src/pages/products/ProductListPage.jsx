import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { CollapsibleSidebar } from '../../components/layout/CollapsibleSidebar';
import { Navbar } from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import ProductModal from '../../components/products/ProductModal';

const ProductsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSubmitModal = async (productData) => {
    try {
      await API.post('/products', productData);
      toast({
        title: 'Producto agregado',
        description: 'El producto ha sido agregado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error al agregar producto',
        description: error.response?.data?.message || 'No se pudo agregar el producto.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Cargar productos desde la API
  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast({
        title: 'Error al cargar productos',
        description: error.response?.data?.message || 'No se pudieron cargar los productos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '240px' : '60px'} p={4}>
          {/* Contenido de la lista de productos */}
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h1" size="lg">
              Productos
            </Heading>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleOpenModal}>
              Nuevo Producto
            </Button>
          </Flex>

          {/* Tabla de productos */}
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Precio</Th>
                <Th>Stock</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)} // Redirige al detalle del producto
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Td>{product.id}</Td>
                  <Td>{product.name}</Td>
                  <Td>${product.price}</Td>
                  <Td>{product.stock}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitModal} />
        </Box>
      </Flex>
    </Box>
  );
};

export default ProductsPage;
