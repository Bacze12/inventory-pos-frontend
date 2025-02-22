import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Flex,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';
import  Navbar  from '../../components/layout/Navbar';
import {getInventoryById} from '../../api/inventory.api';

const InventoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventory, setInventory] = useState(null);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('IN');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchInventory = async () => {
        try {
          const inventoryData = await getInventoryById(id);
          if (inventoryData) {
            setInventory(inventoryData);
            setProductId(inventoryData.productId || '');
            setQuantity(inventoryData.quantity || '');
            setType(inventoryData.type || 'IN');
            setNotes(inventoryData.notes || '');
          } else {
            throw new Error('Datos de inventario no encontrados');
          }
        } catch (err) {
          setError('No se pudo cargar el movimiento de inventario.');
        } finally {
          setIsLoading(false);
        }
      };
      

    fetchInventory();
  }, [id]);

  if (isLoading) {
    return (
      <Box>
        <Navbar onMenuClick={toggleSidebar} />
        <Flex>
          <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          <Center flex="1" ml={isSidebarOpen ? '240px' : '60px'} h="100vh">
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
          <Center flex="1" ml={isSidebarOpen ? '0px' : '0px'} h="100vh">
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
          <Box p={6} bg="white" borderRadius="md" shadow="sm">
            <FormControl mb={4}>
              <FormLabel>ID de Producto</FormLabel>
              <Input
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="ID del Producto"
                type="number"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Cantidad</FormLabel>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Cantidad"
                type="number"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tipo de Movimiento</FormLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="IN">Entrada</option>
                <option value="OUT">Salida</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Notas</FormLabel>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas (opcional)"
              />
            </FormControl>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default InventoryDetailsPage;
