import React, { useState } from 'react';
import { Box, VStack, IconButton, Flex, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Menu as MenuIcon } from 'lucide-react';
import NavItem from './NavItem';

const CollapsibleSidebar = ({ NavItems, navigate, onMenuClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Box
      w={isCollapsed ? '60px' : '250px'}
      bg="white"
      boxShadow="lg"
      h="100vh"
      overflowY="auto"
      position="relative"
      transition="width 0.3s"
    >
      <IconButton
        icon={isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        position="absolute"
        top="10px"
        right={isCollapsed ? '-20px' : '-40px'}
        size="sm"
        bg="white"
        boxShadow="md"
        _hover={{ bg: 'gray.100' }}
      />

      <Flex
        direction="column"
        alignItems={isCollapsed ? 'center' : 'stretch'}
        h="100%"
        p={isCollapsed ? 2 : 4}
      >
        {!isCollapsed && (
          <>
            <IconButton
              onClick={onMenuClick}
              variant="ghost"
              icon={<MenuIcon />}
              aria-label="Open Menu"
            />
          </>
        )}

        <VStack align={isCollapsed ? 'center' : 'stretch'} spacing={4}>
          {NavItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              navigate={navigate}
              isCollapsed={isCollapsed}
            />
          ))}
        </VStack>
      </Flex>
    </Box>
  );
};

export default CollapsibleSidebar;