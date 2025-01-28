// CategoriesListPage.jsx
import React, { useState, useEffect, useToast } from 'react';
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
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
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
      toast({
        title: 'Error al cargar usuarios.',
        description: error.response?.data?.message || 'Error creando categoría:',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCategoryUpdate = async (updatedCategory) => {
    try {
      await API.patch(`/categories/${updatedCategory._id}`, updatedCategory);
      const response = await API.get('/categories');
      setCategories(response.data);
    } catch (err) {
      toast({
        title: 'Error al cargar usuarios.',
        description: error.response?.data?.message || 'Error actualizando categoría:',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      await API.patch(`/categories/${category._id}`, { isActive: !category.isActive });
      const updatedCategories = categories.map(cat =>
        cat._id === category._id ? { ...cat, isActive: !cat.isActive } : cat
      );
      setCategories(updatedCategories);
    } catch (err) {
      toast({
        title: 'Error al cargar usuarios.',
        description: error.response?.data?.message || 'Error actualizando el estado de la categoría:',
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

  return (
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '0px' : '0px'} p={4}>
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
              <Tr key={category._id}>
                <Td>{category._id}</Td>
                <Td>{category.name}</Td>
                <Td>{category.description}</Td>
                <Td>
                    <Switch
                      isChecked={category.isActive}
                      onChange={() => toggleCategoryStatus(category)}
                    />
                  </Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsEditModalOpen(true);
                    }}
                    aria-label="Editar categoría"
                  />
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
