import React from 'react';
import { Box, Text, Icon } from '@chakra-ui/react';

/**
 * BaseState Component
 * Componente reutilizable para mostrar estados con íconos y mensajes.
 * @param {ComponentType} icon - Ícono del estado.
 * @param {string} message - Mensaje a mostrar.
 * @param {string} iconColor - Color del ícono.
 * @param {string} textColor - Color del texto.
 * @param {number} iconSize - Tamaño del ícono.
 * @param {object} styles - Estilos adicionales.
 */
const BaseState = ({
  icon,
  message,
  iconColor = 'gray.400',
  textColor = 'gray.600',
  iconSize = 12,
  styles = {},
}) => {
  return (
    <Box textAlign="center" py={10} px={6} {...styles}>
      <Icon as={icon} boxSize={iconSize} color={iconColor} />
      <Text mt={4} fontSize="lg" color={textColor}>
        {message}
      </Text>
    </Box>
  );
};

export default BaseState;
