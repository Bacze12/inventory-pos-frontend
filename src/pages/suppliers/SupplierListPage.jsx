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
import SupplierModal from '../../components/suppliers/SupplierModal';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import Navbar from '../../components/layout/Navbar';
import EditSupplierModal from '../../components/suppliers/EditSupplierModal';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { getAll, create, update, remove } from '../../api/suppliers.api';

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
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await getAll();
      setSuppliers(response.data);
    } catch (err) {
      setError('No se pudo cargar los proveedores.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleSupplierCreate = async (supplierData) => {
    try {
      // Crear un nuevo objeto sin tenantId ni products si están vacíos
      const newSupplier = { ...supplierData };
      
      // No incluir `products` si está vacío o indefinido
      if (!newSupplier.products || newSupplier.products.length === 0) {
        delete newSupplier.products;
      }
  
      // No incluir `tenantId`, ya que debe venir del JWT en el backend
      delete newSupplier.tenantId;
  
      // Enviar el nuevo proveedor sin `tenantId` ni `products` si es necesario
      await create(newSupplier);
      fetchSuppliers();
  
      toast({
        title: 'Proveedor creado',
        description: 'El proveedor se ha registrado correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al crear proveedor',
        description: err.response?.data?.message || 'Hubo un problema.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleSupplierUpdate = async (updatedSupplier) => {
    try {
      await update(updatedSupplier._id, updatedSupplier);
      fetchSuppliers();
      toast({
        title: 'Proveedor actualizado',
        description: 'Los cambios han sido guardados correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al actualizar proveedor',
        description: 'Hubo un problema al actualizar el proveedor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleSupplierDelete = async (supplier) => {
    try {
      await remove(supplier._id);
      fetchSuppliers();
      toast({
        title: 'Proveedor eliminado',
        description: 'El proveedor ha sido eliminado correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al eliminar proveedor',
        description: 'Hubo un problema al eliminar el proveedor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleSupplierStatus = async (supplier) => {
    try {
      const updatedSupplier = { isActive: !supplier.isActive }; // Solo enviamos isActive
      await update(supplier._id, updatedSupplier);
      fetchSuppliers();
      toast({
        title: 'Estado actualizado',
        description: `El proveedor ha sido ${updatedSupplier.isActive ? 'activado' : 'desactivado'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al cambiar estado',
        description: 'No se pudo cambiar el estado del proveedor.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const filteredSuppliers = suppliers
    .filter((supplier) => {
      if (filterStatus === 'all') return true;
      return filterStatus === 'active' ? supplier.isActive : !supplier.isActive;
    })
    .filter((supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Tr key={supplier._id}>
                  <Td>{supplier.name}</Td>
                  <Td>{supplier.email}</Td>
                  <Td>{supplier.phone}</Td>
                  <Td>{supplier.address}</Td>
                  <Td>
                    <Switch
                      isChecked={supplier.isActive}
                      onChange={() => toggleSupplierStatus(supplier)}
                      colorScheme="green"
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
                  <Td>
                    {/* Boton para eliminar permanentemente el supplier con llamado a la API */}
                    <IconButton icon={<DeleteIcon />} colorScheme="red"  onClick={() => {
                      handleSupplierDelete(supplier);
                    }}/>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <SupplierModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleSupplierCreate} />
          {isEditModalOpen && selectedSupplier && (
            <EditSupplierModal
              isOpen={isEditModalOpen}
              onClose={handleEditModalClose}
              supplier={selectedSupplier}
              onSave={handleSupplierUpdate}
              fetchSuppliers={fetchSuppliers}
            />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SuppliersListPage;
