import React, { useState, useEffect } from 'react';
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
  Button,
  useToast,
} from '@chakra-ui/react';
import { update } from '../../api/suppliers.api';

const EditSupplierModal = ({ isOpen, onClose, supplier, onSave, fetchSuppliers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (supplier) {
      setName(supplier.name || '');
      setEmail(supplier.email || '');
      setPhone(supplier.phone || '');
      setAddress(supplier.address || '');
    }
  }, [supplier]);
  
  const handleUpdateSupplier = async () => {
    try {
      if (!supplier._id) {
        throw new Error('ID del proveedor no encontrado');
      }
  
      // Crear un objeto con solo los campos permitidos y que han cambiado
      const updateData = {
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        isActive: supplier.isActive, // Incluir isActive con su valor actual
      };
  
      // Incluir products solo si está definido y no está vacío
      if (supplier.products && supplier.products.length > 0) {
        updateData.products = supplier.products;
      }
  
      const response = await update(supplier._id, updateData);
  
      if (response.status !== 200) {
        throw new Error('Error al actualizar el proveedor en el servidor');
      }
  
      toast({
        title: 'Proveedor actualizado con éxito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
      onSave({ ...supplier, ...updateData });
      onClose();
      fetchSuppliers();
  
    } catch (error) {
      
      toast({
        title: 'Error al actualizar el proveedor.',
        description: error.message || error.response?.data?.message || 'No se pudo actualizar el proveedor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Proveedor</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del proveedor"
            />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email del proveedor"
              type="email"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Teléfono</FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono del proveedor"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Dirección</FormLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección del proveedor"
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdateSupplier}>
            Guardar Cambios
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditSupplierModal;
