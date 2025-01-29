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
  useToast,
  IconButton,
  Switch,
  Select,
  Input,
} from '@chakra-ui/react';
import API from '../../api/api';
import SupplierModal from '../../components/suppliers/SupplierModal';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';
import EditSupplierModal from '../../components/suppliers/EditSupplierModal';
import { EditIcon } from '@chakra-ui/icons';

const SuppliersListPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const toast = useToast();

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

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleSupplierCreate = async (supplierData) => {
    try {
      await API.post('/suppliers', supplierData);
      setIsModalOpen(false);
      const response = await API.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      toast({
        title: 'Error al crear proveedor.',
        description: err.response?.data?.message || 'Error creando proveedor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSupplierUpdate = async (updatedSupplier) => {
    try {
      await API.patch(`/suppliers/${updatedSupplier._id}`, updatedSupplier);
      const response = await API.get('/suppliers');
      setSuppliers(response.data);
    } catch (err) {
      toast({
        title: 'Error al actualizar proveedor.',
        description: err.response?.data?.message || 'Error actualizando proveedor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleSupplierStatus = async (supplier) => {
    try {
      await API.patch(`/suppliers/${supplier._id}`, { isActive: !supplier.isActive });
      const updatedSuppliers = suppliers.map(sup =>
        sup._id === supplier._id ? { ...sup, isActive: !sup.isActive } : sup
      );
      setSuppliers(updatedSuppliers);
    } catch (err) {
      toast({
        title: 'Error al actualizar el estado del proveedor.',
        description: err.response?.data?.message || 'No se pudo actualizar el estado del proveedor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const filteredSuppliers = suppliers.filter(supplier => {
    if (filterStatus === 'all') return true;
    return filterStatus === 'active' ? supplier.isActive : !supplier.isActive;
  }).filter(supplier => supplier.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
            <Heading mb={4}>Proveedores</Heading>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(true)} mb={4}>
              Añadir Proveedor
            </Button>
          </Flex>
          <Flex mb={4}>
            <Input
              placeholder="Buscar por nombre"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mr={4}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </Select>
          </Flex>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Email</Th>
                <Th>Teléfono</Th>
                <Th>Dirección</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredSuppliers.map((supplier) => (
                <Tr key={supplier.id}>
                  <Td>{supplier.name}</Td>
                  <Td>{supplier.email}</Td>
                  <Td>{supplier.phone}</Td>
                  <Td>{supplier.address}</Td>
                  <Td>
                    <Switch
                      isChecked={supplier.isActive}
                      onChange={() => toggleSupplierStatus(supplier)}
                    />
                  </Td>
                  <Td>
                    <IconButton
                      icon={<EditIcon />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setIsEditModalOpen(true);
                      }}
                      aria-label="Editar proveedor"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {isModalOpen && (
            <SupplierModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleSupplierCreate} />
          )}
          {isEditModalOpen && selectedSupplier && (
            <EditSupplierModal
              isOpen={isEditModalOpen}
              onClose={handleEditModalClose}
              supplier={selectedSupplier}
              onSupplierUpdated={handleSupplierUpdate}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SuppliersListPage;
