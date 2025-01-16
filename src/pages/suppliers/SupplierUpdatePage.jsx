// SupplierUpdatePage.jsx
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
import  Navbar  from '../../components/layout/Navbar';

const SupplierUpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await API.get(`/suppliers/${id}`);
        setSupplier(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setAddress(response.data.address);
      } catch (err) {
        setError('No se pudo cargar el proveedor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await API.patch(`/suppliers/${id}`, { name, email, phone, address });
      navigate('/suppliers');
    } catch (err) {
      setError('No se pudo actualizar el proveedor.');
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
          <Box p={6} bg="white" borderRadius="md" shadow="sm">
            <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del proveedor"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email del proveedor"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Teléfono</FormLabel>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Teléfono del proveedor"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Dirección</FormLabel>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Dirección del proveedor"
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

export default SupplierUpdatePage;
