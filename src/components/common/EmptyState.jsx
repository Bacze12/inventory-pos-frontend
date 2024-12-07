import { Box, Text, Icon } from '@chakra-ui/react';
import { Package } from 'lucide-react';

/**
 * EmptyState Component
 * @param {string} message - Mensaje a mostrar cuando no hay datos.
 * @param {ComponentType} icon - Ícono que representa el estado vacío.
 * @param {string} iconColor - Color del ícono (por defecto 'gray.400').
 * @param {string} textColor - Color del texto (por defecto 'gray.600').
 * @param {number} iconSize - Tamaño del ícono (por defecto 12).
 * @param {object} styles - Estilos adicionales para el contenedor.
 */
export const EmptyState = ({
  message = 'No hay datos disponibles.',
  icon = Package,
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
