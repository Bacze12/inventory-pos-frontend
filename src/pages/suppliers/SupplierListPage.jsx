// SuppliersListPage.jsx
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
import SupplierModal from '../../components/suppliers/SupplierModal';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';

const SuppliersListPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await API.get('/suppliers');
        setSuppliers(response.data);
      } catch (err) {
        setError('No se pudo cargar los proveedores.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSupplierCreate = async (supplierData) => {
    try {
      await API.post('/suppliers', supplierData);
      setIsModalOpen(false);
      const response = await API.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error creando proveedor:', err);
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
          <Heading mb={4}>Proveedores</Heading>
          <Button colorScheme="blue" onClick={() => setIsModalOpen(true)} mb={4}>
            Añadir Proveedor
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Teléfono</Th>
                <Th>Dirección</Th>
                <Th>Activo</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {suppliers.map((supplier) => (
                <Tr key={supplier.id}>
                  <Td>{supplier.id}</Td>
                  <Td>{supplier.name}</Td>
                  <Td>{supplier.email}</Td>
                  <Td>{supplier.phone}</Td>
                  <Td>{supplier.address}</Td>
                  <Td>{supplier.isActive ? 'Sí' : 'No'}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => navigate(`/suppliers/${supplier.id}`)}
                    >
                      Editar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {isModalOpen && (
            <SupplierModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleSupplierCreate} />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SuppliersListPage;
