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
  Switch,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import API from '../../api/api';
import CategoryModal from '../../components/categories/CategoriesModal';
import CollapsibleSidebar  from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';
import { EditIcon } from '@chakra-ui/icons';
import EditCategoryModal from '../../components/categories/EditCategoryModal';

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cargar las categorías.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategoryStatus = async (categoryId, isActive) => {
    try {
      await API.patch(`/categories/${categoryId}`, { isActive: !isActive });
      fetchCategories(); // Recargar las categorías después de cambiar el estado
      toast({
        title: 'Estado de la categoría actualizado.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al actualizar el estado de la categoría.',
        description: error.response?.data?.message || 'No se pudo actualizar el estado de la categoría',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCategoryCreate = async (categoryData) => {
    try {
      await API.post('/categories', categoryData);
      fetchCategories(); // Recargar las categorías después de crear una nueva
      toast({
        title: 'Categoría creada con éxito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleCreateModalClose();
    } catch (error) {
      toast({
        title: 'Error al crear la categoría.',
        description: error.response?.data?.message || 'No se pudo crear la categoría',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleCategoryUpdated = () => {
    fetchCategories(); // Recargar las categorías después de actualizar una
  };

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
          <Heading mb={4}>Categorías</Heading>
          <Button colorScheme="blue" onClick={() => setIsCreateModalOpen(true)} mb={4}>
            Crear Categoría
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Descripción</Th>
                <Th>Activo</Th>
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
                    colorScheme="green"
                    isChecked={category.isActive}
                    onChange={() => toggleCategoryStatus(category._id, category.isActive)}
                  />
                </Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => handleOpenEditModal(category)}
                    aria-label="Editar usuario"
                    ml={2}
                  />
                </Td>
              </Tr>
            ))}
            </Tbody>
          </Table>
          {isCreateModalOpen && (
            <CategoryModal
              isOpen={isCreateModalOpen}
              onClose={handleCreateModalClose}
              onSubmit={handleCategoryCreate}
            />
          )}
          {isEditModalOpen && (
            <EditCategoryModal
              isOpen={isEditModalOpen}
              onClose={handleEditModalClose}
              category={selectedCategory}
              onCategoryUpdated={handleCategoryUpdated}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CategoriesListPage;
