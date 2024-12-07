import React from 'react';
import { Center, Spinner, Box } from '@chakra-ui/react';

/**
 * LoadingOverlay Component
 * @param {boolean} isLoading - Si `true`, muestra la superposición de carga.
 */
export const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      bg="rgba(0, 0, 0, 0.5)"
      zIndex="1000"
    >
      <Center h="100%">
        <Spinner size="xl" color="white" />
      </Center>
    </Box>
  );
};
