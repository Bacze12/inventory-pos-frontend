// InventoryListPage.jsx
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
import InventoryModal from '../../components/Inventory/InventoryModal';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';

const InventoryListPage = () => {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await API.get('/inventory');
        setInventory(response.data);
      } catch (err) {
        setError('No se pudo cargar el inventario.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInventoryCreate = async (inventoryData) => {
    try {
      await API.post('/inventory', inventoryData);
      setIsModalOpen(false);
      const response = await API.get('/inventory');
      setInventory(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creando movimiento de inventario:');
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Navbar onMenuClick={toggleSidebar} />
        <Flex>
          <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          <Center flex="1" ml={isSidebarOpen ? '0px' : '0px'} h="100vh">
            <Spinner size="xl" />
          </Center>
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Navbar onMenuClick={toggleSidebar} />
        <Flex>
          <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          <Center flex="1" ml={isSidebarOpen ? '240px' : '60px'} h="100vh">
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          </Center>
        </Flex>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '240px' : '60px'} p={4}>
          <Heading mb={4}>Inventario</Heading>
          <Button colorScheme="blue" onClick={() => setIsModalOpen(true)} mb={4}>
            Añadir Movimiento
          </Button>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Producto</Th>
                <Th>Cantidad</Th>
                <Th>Tipo</Th>
                <Th>Fecha</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {inventory.map((item) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.Product?.name}</Td>
                  <Td>{item.quantity}</Td>
                  <Td>{item.type}</Td>
                  <Td>{new Date(item.date).toLocaleDateString()}</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => navigate(`/inventory/${item.id}`)}
                    >
                      Ver/Editar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {isModalOpen && (
            <InventoryModal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleInventoryCreate} />
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default InventoryListPage;
