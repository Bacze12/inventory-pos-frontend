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
  Input,
  Switch,
  IconButton,
  useToast,
  ButtonGroup,
  Select,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import CategoryModal from '../../components/categories/CategoriesModal';
import CollapsibleSidebar  from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';
import EditCategoryModal from '../../components/categories/EditCategoryModal';
import {getAll, create, update, remove} from '../../api/categories.api';

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
        const response = await getAll();
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
      // Make sure categoryData contains valid name and description
      await create({
        name: categoryData.name, 
        description: categoryData.description,
      });
      
      setIsModalOpen(false);
      fetchCategories(); // Reload categories
    } catch (err) {
      handleError('Error creando categoría:', err);
    }
  };
  const handleCategoryUpdate = async (updatedCategory) => {
    try {
      await update(selectedCategory._id, updatedCategory);
      fetchCategories(); // Reload categories
      toast({
        title: 'Categoría actualizada',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al actualizar la categoría',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCategoryDelete = async (categories) => {
    try {
      await remove(categories._id);
      fetchCategories(); // Reload categories
      toast({
        title: "Categoría eliminada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al eliminar categoria',
        description: 'Hubo un problema al eliminar el proveedor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleCategoryStatus = async (category) => {
    try {
      const updatedCategory = { isActive: !category.isActive };
      await update(category._id, updatedCategory);
      fetchCategories(); // Recargar las categorías
      toast({
        title: 'Estado de la categoría actualizado',
        description: `El proveedor ha sido ${updatedCategory.isActive ? 'activado' : 'desactivado'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al actualizar el estado de la categoría',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
};
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  
  const filteredCategories = categories
    .filter((category) => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'active' ? category.isActive : !category.isActive;
    })
    .filter((category) => 
       category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
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
          <Flex mb={4}>
            <Input 
            placeholder="Buscar categoría" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            mr={4} />
            <Select value={filterStatus}
             onChange={(e) => setFilterStatus(e.target.value)} >
              <option value="all">Todas</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </Select>
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
              {filteredCategories.map((category) => (
              <Tr key={category._id}>
                <Td>{category.name}</Td>
                <Td>{category.description}</Td>
                <Td>
                  <Switch
                    isChecked={category.isActive}
                    onChange={() => toggleCategoryStatus(category)}
                    colorScheme='green'
                  />
                </Td>
                <Td>
                  <ButtonGroup>
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      variant={'outline'}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditModalOpen(true);
                      }}
                      aria-label="Editar categoría"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleCategoryDelete(category)}
                    />
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
            </Tbody>
          </Table>
          <CategoryModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleCategoryCreate} />
          {isEditModalOpen && selectedCategory && (
            <EditCategoryModal
              isOpen={isEditModalOpen}
              onClose={handleEditModalClose}
              category={selectedCategory}
              onSave={handleCategoryUpdate}
              fetchCategory={fetchCategories}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CategoriesListPage;
