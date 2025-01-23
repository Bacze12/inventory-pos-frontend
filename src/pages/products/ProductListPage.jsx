import React, { useState, useEffect, useCallback } from 'react';
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
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import ProductModal from '../../components/products/ProductModal';

const ProductsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cancelRef = React.useRef();
  const toast = useToast();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleError = useCallback(
    (message, error) => {
      toast({
        title: message,
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        setProducts(response.data);
      } catch (error) {
        handleError('Error al cargar productos:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories');
        setCategories(
          response.data.map((category) => ({
            id: category._id, // MongoDB devuelve _id como string
            name: category.name,
          }))
        );
      } catch (error) {
        handleError('Error al cargar categorías:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await API.get('/suppliers');
        setSuppliers(
          response.data.map((supplier) => ({
            id: supplier._id, // MongoDB devuelve _id como string
            name: supplier.name,
          }))
        );
      } catch (error) {
        handleError('Error al cargar proveedores:', error);
      }
    };

    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, [handleError]);

  const handleDeleteProduct = async () => {
    try {
      await API.delete(`/products/${selectedProduct._id}`);
      setProducts(products.filter((product) => product._id !== selectedProduct._id));
      toast({
        title: 'Producto eliminado',
        description: 'El producto ha sido eliminado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setAlertOpen(false);
    } catch (error) {
      handleError('Error al eliminar producto:', error);
    }
  };

  const handleOpenAlert = (product) => {
    setSelectedProduct(product);
    setAlertOpen(true);
  };

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === '' || product.categoryId === selectedCategory) &&
      (selectedSupplier === '' || product.supplier === selectedSupplier)
    );
  });

  return (
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '0px' : '0px'} p={4}>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading as="h1" size="lg">
              Productos
            </Heading>
            <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleOpenModal}>
              Nuevo Producto
            </Button>
          </Flex>

          <Flex mb={4} gap={4}>
            <Select
              placeholder="Filtrar por categoría"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Filtrar por proveedor"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
            >
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </Flex>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>SKU</Th>
                <Th>Nombre</Th>
                <Th>Precio</Th>
                <Th>Stock</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map((product) => (
                <Tr
                  key={product._id}
                  onClick={() => navigate(`/products/${product._id}`)}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Td>{product.sku}</Td>
                  <Td>{product.name}</Td>
                  <Td>${product.finalPrice.toLocaleString('es-CL')}</Td>
                  <Td>{product.stock}</Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAlert(product);
                      }}
                      aria-label="Eliminar producto"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>

      {/* Modal de agregar producto */}
      <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleOpenModal} />

      {/* Modal de confirmación de eliminación */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Producto
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Está seguro de que desea eliminar el producto {selectedProduct?.name}? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setAlertOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDeleteProduct} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductsPage;
