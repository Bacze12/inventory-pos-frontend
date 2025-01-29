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
import API from '../../api/api';

const EditSupplierModal = ({ isOpen, onClose, supplier, onSupplierUpdated }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (supplier) {
        setName(supplier.name);
        setEmail(supplier.email);
        setPhone(supplier.phone);
        setAddress(supplier.address);
        }
    }, [supplier]);

    const handleUpdateSupplier = async () => {
        try {
            const updatedSupplier = { ...supplier, name, email, phone, address };
            await API.patch(`/suppliers/${supplier._id}`, updatedSupplier);
            toast({
                title: 'Proveedor actualizado con éxito.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onSupplierUpdated(updatedSupplier);
            onClose();
            } catch (error) {
            toast({
                title: 'Error al actualizar el proveedor.',
                description: error.response?.data?.message || 'No se pudo actualizar el proveedor',
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
            <FormControl mb={4}>
                <FormLabel>Nombre</FormLabel>
                <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del proveedor"
                />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email del proveedor"
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