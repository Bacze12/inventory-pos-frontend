import React, { useState } from 'react';
import { Box, Flex, Grid, GridItem, Text, Heading, Button, Icon } from '@chakra-ui/react';
import { FaShoppingCart, FaChartBar, FaUsers, FaCog } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdInventory } from 'react-icons/md';
import CollapsibleSidebar from '../components/layout/CollapsibleSidebar';
import  Navbar  from '../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />

      <Flex>
        {/* Barra lateral */}
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

        {/* Contenido principal */}
        <Box
          flex="1"
          p={5}
          minH="100vh"
          ml={isSidebarOpen ? '0px' : '0px'} // Ajustar margen izquierdo según el estado de la barra lateral
          transition="margin-left 0.3s"
        >
          {/* Encabezado */}
          <Heading as="h1" size="lg" mb={2}>
            Bienvenido
          </Heading>
          <Text fontSize="lg" mb={6}>
            ¿Qué te gustaría hacer hoy?
          </Text>

          {/* Acciones principales */}
          <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={10}>
            <GridItem
              shadow="md"
              rounded="md"
              border="1px"
              borderColor="gray.200"
              p={6}
              cursor="pointer"
              _hover={{ shadow: 'lg' }}
              onClick={() => navigate('/')}
            >
              <Flex align="center" mb={4}>
                <Icon as={FaShoppingCart} boxSize={6} color="blue.500" />
                <Text fontWeight="bold" ml={4}>
                  Ventas
                </Text>
              </Flex>
              <Text color="gray.950">Gestiona tus ventas y transacciones</Text>
            </GridItem>

            <GridItem
              shadow="md"
              rounded="md"
              p={6}
              border="1px"
              borderColor="gray.200"
              cursor="pointer"
              _hover={{ shadow: 'lg' }}
              onClick={() => navigate('/reportes')}
            >
              <Flex align="center" mb={4}>
                <Icon as={FaChartBar} boxSize={6} color="green.500" />
                <Text fontWeight="bold" ml={4}>
                  Reportes
                </Text>
              </Flex>
              <Text color="gray.950">Visualiza estadísticas y análisis</Text>
            </GridItem>

            <GridItem
              shadow="md"
              rounded="md"
              p={6}
              border="1px"
              borderColor="gray.200"
              cursor="pointer"
              _hover={{ shadow: 'lg' }}
              onClick={() => navigate('/users')}
            >
              <Flex align="center" mb={4}>
                <Icon as={FaUsers} boxSize={6} color="purple.500" />
                <Text fontWeight="bold" ml={4}>
                  Usuarios
                </Text>
              </Flex>
              <Text color="gray.950">Administra usuarios y permisos</Text>
            </GridItem>

            <GridItem
              shadow="md"
              rounded="md"
              p={6}
              border="1px"
              borderColor="gray.200"
              cursor="pointer"
              _hover={{ shadow: 'lg' }}
              onClick={() => navigate('/settings')}
            >
              <Flex align="center" mb={4}>
                <Icon as={FaCog} boxSize={6} color="orange.500" />
                <Text fontWeight="bold" ml={4}>
                  Configuración
                </Text>
              </Flex>
              <Text color="gray.950">Configura tu sistema</Text>
            </GridItem>
          </Grid>

          {/* Accesos rápidos */}
          <Heading size="md" mb={4}>
            Accesos Rápidos
          </Heading>
          <Flex gap={4}>
            <Button
              leftIcon={<AiOutlinePlus />}
              colorScheme="green"
              variant="outline"
              flex="1"
              onClick={() => navigate('/nueva-venta')}
            >
              Nueva Venta
            </Button>
            <Button
              leftIcon={<FaChartBar />}
              colorScheme="green"
              variant="outline"
              flex="1"
              onClick={() => navigate('/reporte-diario')}
            >
              Reporte Diario
            </Button>
            <Button
              leftIcon={<MdInventory />}
              colorScheme="green"
              variant="outline"
              flex="1"
              onClick={() => navigate('/inventory')}
            >
              Inventario
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Home;
