// CategoriesListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
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
  Switch,
  IconButton,
  useToast,
  ButtonGroup,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import API from '../../api/api';
import CategoryModal from '../../components/categories/CategoriesModal';
import CollapsibleSidebar  from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';
import EditCategoryModal from '../../components/categories/EditCategoryModal';

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
    const toast = useToast();

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

    useEffect(() => {
      fetchCategories();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCategoryCreate = async (categoryData) => {
    try {
      await API.post('/categories', categoryData);
      setIsModalOpen(false);
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (err) {
      handleError('Error creando categoría:', err);
    }
  };

  const handleCategoryUpdate = async (updatedCategory) => {
    try {
      await API.patch(`/categories/${updatedCategory._id}`, updatedCategory);
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (err) {
      handleError('Error actualizando categoría:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      toast({
        title: "Categoría eliminada",
        status: "success",
        duration: 3000
      });
      fetchCategories(); // Recargar las categorías
    } catch (err) {
      handleError('Error eliminando categoría:', err);
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      await API.patch(`/categories/${category._id}`, { isActive: !category.isActive });
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (err) {
      handleError('Error actualizando el estado de la categoría:', err);
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
        <Box flex="1" ml={isSidebarOpen ? '0px' : '0px'} p={4}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading mb={4}>Categorías</Heading>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(true)} mb={4}>
              Crear Categoría
            </Button>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Descripción</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {categories.map((category) => (
              <Tr key={category._id}>
                <Td>{category.name}</Td>
                <Td>{category.description}</Td>
                <Td>
                  <Switch
                    isChecked={category.isActive}
                    onChange={() => toggleCategoryStatus(category)}
                  />
                </Td>
                <Td>
                  <ButtonGroup>
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditModalOpen(true);
                      }}
                      aria-label="Editar categoría"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(category._id)}
                      aria-label="Eliminar categoría"
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
            </Tbody>
          </Table>
          {isModalOpen && (
            <CategoryModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleCategoryCreate} />
          )}
          {isEditModalOpen && selectedCategory && (
            <EditCategoryModal
              isOpen={isEditModalOpen}
              onClose={handleEditModalClose}
              category={selectedCategory}
              onCategoryUpdated={handleCategoryUpdate}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CategoriesListPage;
