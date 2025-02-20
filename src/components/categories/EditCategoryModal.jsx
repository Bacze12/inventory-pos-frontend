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
import { update } from '../../api/categories.api';

const EditCategoryModal = ({ isOpen, onClose, category, onSave, fetchCategory }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (category) {
        setName(category.name || '');
        setDescription(category.description || '');
        }
    }, [category]);

    const handleUpdateCategory = async () => {
        try {
        if (!category._id) {
            throw new Error('ID de la categoría no encontrado');
        }
        // Crear un objeto con solo los campos permitidos y que han cambiado
        const updateData = {
            name: name.trim() || undefined,
            description: description.trim() || undefined,
            isActive: category.isActive, // Incluir isActive con su valor actual
        };
        
        const response = await update(category._id, updateData);
        if (response.status !== 200) {
            throw new Error('Error al actualizar la categoría en el servidor');
        }

        toast({
            title: 'Categoría actualizada con éxito.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });

        onSave({ ...category, ...updateData });
        onClose();
        fetchCategory(); // Recargar la categoría
        
        } catch (error) {
        toast({
            title: 'Error al actualizar la categoría.',
            description: error.response?.data?.message || 'No se pudo actualizar la categoría',
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
                <ModalHeader>Editar Categoría</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <FormControl mb={4}>
                    <FormLabel>Nombre</FormLabel>
                    <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nombre de la categoría"
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Descripción</FormLabel>
                    <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción de la categoría"
                    />
                </FormControl>
                </ModalBody>
                <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleUpdateCategory}>
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

export default EditCategoryModal;