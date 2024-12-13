// InventoryModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
} from '@chakra-ui/react';

const InventoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('IN');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const inventoryData = {
      productId: parseInt(productId),
      quantity: parseInt(quantity),
      type,
      notes,
    };
    onSubmit(inventoryData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Añadir Movimiento de Inventario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>ID de Producto</FormLabel>
            <Input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="ID del Producto"
              type="number"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Cantidad</FormLabel>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Cantidad"
              type="number"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Tipo de Movimiento</FormLabel>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="IN">Entrada</option>
              <option value="OUT">Salida</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Notas</FormLabel>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas (opcional)"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InventoryModal;
