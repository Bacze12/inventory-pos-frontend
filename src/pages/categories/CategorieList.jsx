// CategoriesListPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import CategoryModal from '../../components/categories/CategoriesModal';
import { CollapsibleSidebar } from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories');
        setCategories(response.data);
      } catch (err) {
        setError('No se pudo cargar las categorías.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCategoryCreate = async (categoryData) => {
    try {
      await API.post('/categories', categoryData);
      setIsModalOpen(false);
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error creando categoría:', err);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
          <Heading mb={4}>Categorías</Heading>
          <Button colorScheme="blue" onClick={() => setIsModalOpen(true)} mb={4}>
            Crear Categoría
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Descripción</Th>
                <Th>Activo</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map((category) => (
                <Tr key={category.id}>
                  <Td>{category.id}</Td>
                  <Td>{category.name}</Td>
                  <Td>{category.description}</Td>
                  <Td>{category.isActive ? 'Sí' : 'No'}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => navigate(`/categories/${category.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {isModalOpen && (
            <CategoryModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleCategoryCreate} />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CategoriesListPage;
