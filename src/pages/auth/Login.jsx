import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Heading, 
  VStack,
  Link,
  Text, 
  Spinner } from '@chakra-ui/react'
import useAlert from '../../hooks/useAlert';
import authApi from '../../api/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const alert = useAlert();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.post('/login', { email, password });
      alert.success('Login successful!');
      navigate('/home');
    } catch (error) {
      alert.error(error.response?.data?.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgGradient="linear(to-r, blue.500, teal.500)"
    >
      <Box
        bg="white"
        p={8}
        rounded="md"
        shadow="lg"
        maxWidth="400px"
        w="full"
      >
        <Heading as="h1" size="lg" textAlign="center" mb={6}>
          Inicio de Sesion
        </Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Correo</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su correo"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escriba su contraseña"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="teal"
              width="full"
              isLoading={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Ingresar'}
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          ¿Se te olvido la contraseña?{' '}
          <Link color="teal.500" onClick={() => navigate('/recover-password')}>
            Recuperar contraseña
          </Link>
        </Text>
        <Text mt={2} textAlign="center">
          ¿No tienes una cuenta?{' '}
          <Link color="teal.500" onClick={() => navigate('/register')}>
            Registrate
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default LoginPage;
