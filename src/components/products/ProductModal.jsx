import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';

/**
 * Componente ProductModal
 * @param {boolean} isOpen - Controla si el modal está abierto.
 * @param {Function} onClose - Función para cerrar el modal.
 * @param {Function} onSubmit - Función que maneja la creación o actualización del producto.
 * @param {Object} [initialData] - Datos iniciales del producto (opcional).
 */
const ProductModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
    } else {
      setName('');
      setPrice('');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      toast({
        title: 'Datos inválidos',
        description: 'Por favor, completa todos los campos correctamente.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSubmit({ name, price: parseFloat(price) });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? 'Editar Producto' : 'Agregar Producto'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre del Producto</FormLabel>
            <Input
              placeholder="Ingresa el nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Precio</FormLabel>
            <Input
              type="number"
              placeholder="Ingresa el precio"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {initialData ? 'Guardar Cambios' : 'Agregar'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;