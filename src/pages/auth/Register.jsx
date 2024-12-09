import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', name: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    if (!formData.email || !formData.name || !formData.password) {
      toast({
        title: 'Todos los campos son requeridos.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await API.post('/users', formData);
      toast({
        title: 'Cuenta creada con éxito.',
        description: 'Ahora puedes iniciar sesión.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login'); // Redirige a la página de inicio de sesión
    } catch (error) {
      toast({
        title: 'Error al crear la cuenta.',
        description: error.response?.data?.message || 'Intenta nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex align="center" justify="center" bgGradient="linear(to-r, blue.400, teal.400)" minH="100vh" p={4}>
      <Box bg="white" p={8} rounded="lg" shadow="lg" w={{ base: '90%', md: '400px' }}>
        <Heading as="h1" size="lg" mb={6} textAlign="center" color="blue.600">
          Crear Cuenta
        </Heading>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Correo</FormLabel>
            <Input
              type="email"
              placeholder="Ingresa tu correo"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="Ingresa tu nombre"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Contraseña</FormLabel>
            <Input
              type="password"
              placeholder="Ingresa tu contraseña"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            width="full"
            isLoading={isSubmitting}
            onClick={handleRegister}
          >
            Crear Cuenta
          </Button>
        </VStack>
        <Text mt={4} textAlign="center">
          ¿Ya tienes una cuenta?{' '}
          <Button variant="link" colorScheme="blue" onClick={() => navigate('/login')}>
            Inicia sesión aquí
          </Button>
        </Text>
      </Box>
    </Flex>
  );
};

export default Register;
