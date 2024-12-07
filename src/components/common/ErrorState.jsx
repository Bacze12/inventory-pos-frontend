import React from 'react';
import { Box, Text, Icon, Button, VStack } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';

/**
 * ErrorState Component
 * @param {string} message - Mensaje de error a mostrar.
 * @param {ComponentType} icon - Ícono a mostrar (por defecto AlertTriangle).
 * @param {function} onRetry - Función opcional para reintentar.
 * @param {string} retryText - Texto del botón de reintento (si se proporciona).
 */
export const ErrorState = ({
  message = 'Ocurrió un error inesperado.',
  icon = AlertTriangle,
  onRetry,
  retryText = 'Reintentar',
}) => {
  return (
    <Box textAlign="center" py={10} px={6}>
      <VStack spacing={4}>
        <Icon as={icon} boxSize={12} color="red.500" />
        <Text fontSize="lg" color="red.500">
          {message}
        </Text>
        {onRetry && (
          <Button colorScheme="blue" onClick={onRetry}>
            {retryText}
          </Button>
        )}
      </VStack>
    </Box>
  );
};
