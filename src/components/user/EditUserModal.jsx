// src/components/user/EditUserModal.jsx
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

const EditUserModal = ({ isOpen, onClose, user, onUserUpdated }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (user) {
        setName(user.name);
        setEmail(user.email);
        }
    }, [user]);

    const handleUpdateUser = async () => {
        try {
        await API.patch(`/users/${user._id}`, { name, email, password });
        toast({
            title: 'Usuario actualizado con éxito.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onUserUpdated();
        onClose();
        } catch (error) {
        toast({
            title: 'Error al actualizar el usuario.',
            description: error.response?.data?.message || 'No se pudo actualizar el usuario',
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
            <ModalHeader>Editar Usuario</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <FormControl mb={4}>
                <FormLabel>Nombre</FormLabel>
                <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del usuario"
                />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Correo</FormLabel>
                <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo del usuario"
                />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Contraseña</FormLabel>
                <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nueva contraseña (opcional)"
                />
            </FormControl>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateUser}>
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

export default EditUserModal;