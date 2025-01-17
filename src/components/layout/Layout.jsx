import React from 'react';
import {
  Box,
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import  Navbar  from './Navbar';
import CollapsibleSidebar from './CollapsibleSidebar';

export const Layout = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex h="100vh">
      <CollapsibleSidebar isOpen={isOpen} onToggle={onToggle} />
      <Box
        flex="1"
        ml={isOpen ? '150px' : '60px'}
        transition="margin-left 0.3s"
      >
        <Navbar onMenuClick={onToggle} isSidebarOpen={isOpen} userName={''} />
        <Box>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;