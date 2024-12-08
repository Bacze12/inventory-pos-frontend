import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import CollapsibleSidebar from './CollapsibleSidebar';
import { Navbar } from './Navbar';
import { useNavigate } from 'react-router-dom';

// Elementos de navegación
const navItems = [
  { path: '/ventas', label: 'Ventas', icon: require('react-icons/fa').FaShoppingCart },
  { path: '/reportes', label: 'Reportes', icon: require('react-icons/fa').FaChartBar },
  { path: '/usuarios', label: 'Usuarios', icon: require('react-icons/fa').FaUsers },
  { path: '/configuracion', label: 'Configuración', icon: require('react-icons/fa').FaCog },
];

const Layout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <Box>
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />

      <Flex>
        {/* Barra lateral */}
        {isSidebarOpen && <CollapsibleSidebar NavItems={navItems} navigate={navigate} />}

        {/* Contenido principal */}
        <Box flex="1" p={6} bg="gray.50" minH="100vh">
          <Outlet />
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
