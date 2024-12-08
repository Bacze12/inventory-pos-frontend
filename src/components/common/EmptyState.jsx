import React from 'react';
import { Package } from 'lucide-react';
import BaseState from './BaseState';

/**
 * EmptyState Component
 * @param {string} message - Mensaje para el estado vacío.
 * @param {ComponentType} icon - Ícono para el estado vacío.
 * @param {string} iconColor - Color del ícono.
 * @param {string} textColor - Color del texto.
 * @param {number} iconSize - Tamaño del ícono.
 * @param {object} styles - Estilos adicionales.
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
    <BaseState
      icon={icon}
      message={message}
      iconColor={iconColor}
      textColor={textColor}
      iconSize={iconSize}
      styles={styles}
    />
  );
};

export default EmptyState;
