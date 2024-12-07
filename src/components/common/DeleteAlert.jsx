import React from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button } from '@chakra-ui/react';
import useAlert from '../../hooks/useAlert';

export const DeleteAlert = ({ isOpen, onClose, onDelete, title, description }) => {
  const cancelRef = React.useRef();
  const { showAlert } = useAlert();

  const handleDelete = () => {
    onDelete();
    showAlert({
      title: title || 'Elemento eliminado',
      description: description || 'Se eliminó correctamente el elemento.',
      status: 'success',
    });
    onClose();
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title || 'Eliminar elemento'}
          </AlertDialogHeader>
          <AlertDialogBody>
            {description || '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.'}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteAlert;
