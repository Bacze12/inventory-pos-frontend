import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import Navbar from '../../components/layout/Navbar';

const CategoryUpdatePage = () => {
  const { _id } = useParams(); // Obtenemos el ID de la categoría desde la URL
  const navigate = useNavigate();
  // const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await API.get(`/categories/${_id}`); // Usamos _id directamente
        // setCategory(response.data); // Guardamos la categoría completa
        setName(response.data.name); // Inicializamos el nombre
        setDescription(response.data.description); // Inicializamos la descripción
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar la categoría.');
      } finally {
        setIsLoading(false);
      }
    };

    if (_id) {
      fetchCategory();
    }
  }, [_id]); // Escucha cambios en _id

  const handleSubmit = async () => {
    try {
      await API.patch(`/categories/${_id}`, { name, description }); // Incluye el campo "description"
      navigate('/categories'); // Navega a la lista de categorías
    } catch (err) {
      setError( err.response?.data?.message || 'No se pudo actualizar la categoría.');
    }
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
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '0px' : '0px'} p={4}>
          <Box p={6} bg="white" borderRadius="md" shadow="sm">
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre de la categoría"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Descripción</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción de la categoría"
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Guardar Cambios
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CategoryUpdatePage;
