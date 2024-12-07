import React from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { AlertTriangle } from 'lucide-react';
import BaseState from './BaseState';

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
    <VStack spacing={4}>
      <BaseState
        icon={icon}
        message={message}
        iconColor="red.500"
        textColor="red.500"
        iconSize={12}
      />
      {onRetry && (
        <Button colorScheme="blue" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </VStack>
  );
};

export default ErrorState;
