import {
    Box,
    SimpleGrid,
    Heading,
    Text,
    Flex,
    Icon,
    Button,
  } from '@chakra-ui/react';
  import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Plus,
    Clipboard,
    Package,
  } from 'lucide-react';
  import { useNavigate } from 'react-router-dom';
  import React from 'react';
  
  const Dashboard = () => {
    const navigate = useNavigate();
  
    // Secciones principales
    const sections = [
      {
        title: 'Dashboard',
        description: 'Gestión y estadísticas generales',
        icon: LayoutDashboard,
        path: '/dashboard',
      },
      {
        title: 'Reportes',
        description: 'Visualiza estadísticas y análisis',
        icon: FileText,
        path: '/reportes',
      },
      {
        title: 'Usuarios',
        description: 'Gestión de usuarios y permisos',
        icon: Users,
        path: '/usuarios',
      },
      {
        title: 'Configuración',
        description: 'Personaliza tu sistema',
        icon: Settings,
        path: '/configuracion',
      },
    ];
  
    // Accesos rápidos
    const quickAccess = [
      {
        title: 'Nueva Venta',
        description: 'Crea una nueva transacción',
        icon: Plus,
        path: '/ventas',
      },
      {
        title: 'Reporte Diario',
        description: 'Consulta las transacciones del día',
        icon: Clipboard,
        path: '/reporte-diario',
      },
      {
        title: 'Inventario',
        description: 'Gestión de productos',
        icon: Package,
        path: '/inventario',
      },
    ];
  
    return (
      <Box p={6}>
        {/* Bienvenida */}
        <Box mb={8}>
          <Heading size="lg" mb={2}>
            Bienvenido, Usuario
          </Heading>
          <Text color="gray.500">¿Qué te gustaría hacer hoy?</Text>
        </Box>
  
        {/* Secciones principales */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          {sections.map((section) => (
            <Box
              key={section.title}
              bg="white"
              p={6}
              shadow="sm"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              _hover={{ shadow: 'md', cursor: 'pointer' }}
              onClick={() => navigate(section.path)}
            >
              <Flex align="center" mb={4}>
                <Icon as={section.icon} boxSize={6} mr={4} />
                <Heading size="md">{section.title}</Heading>
              </Flex>
              <Text color="gray.500">{section.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
  
        {/* Accesos rápidos */}
        <Box>
          <Heading size="md" mb={4}>
            Accesos Rápidos
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {quickAccess.map((access) => (
              <Button
                key={access.title}
                variant="outline"
                colorScheme="blue"
                size="lg"
                p={6}
                justifyContent="flex-start"
                leftIcon={<Icon as={access.icon} boxSize={6} />}
                onClick={() => navigate(access.path)}
              >
                <Box textAlign="left">
                  <Text fontWeight="bold">{access.title}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {access.description}
                  </Text>
                </Box>
              </Button>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    );
  };
  
  export default Dashboard;
  