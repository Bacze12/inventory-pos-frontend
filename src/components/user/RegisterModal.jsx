import React, { useState } from 'react';
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
  VStack,
} from '@chakra-ui/react';

/**
 * Componente RegisterModal
 * @param {boolean} isOpen - Controla si el modal está visible.
 * @param {Function} onClose - Función para cerrar el modal.
 * @param {Function} onSubmit - Función que maneja el registro de un nuevo usuario.
 */
const RegisterModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleRegister = () => {
    if (!name || !email || !password) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor, completa todos los campos.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Contraseña débil',
        description: 'La contraseña debe tener al menos 6 caracteres.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSubmit({ name, email, password });
    onClose();
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registrar Usuario</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                placeholder="Ingrese el nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                type="email"
                placeholder="Ingrese el correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                placeholder="Ingrese la contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleRegister}>
            Registrar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;
