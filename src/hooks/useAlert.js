import { useToast } from '@chakra-ui/react';

/**
 * useAlert Hook
 * Simplifica el uso de `Toast` para mostrar notificaciones en la aplicación.
 */
const useAlert = () => {
  const toast = useToast();

  /**
   * Muestra una alerta genérica.
   * @param {string} title - Título de la alerta.
   * @param {string} description - Descripción de la alerta.
   * @param {string} status - Estado de la alerta ('success', 'error', 'warning', 'info').
   */
  const showAlert = ({ title, description, status }) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return { showAlert };
};

export default useAlert;
