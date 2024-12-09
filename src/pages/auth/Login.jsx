import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Heading, 
  VStack,
  Link,
  Text, 
  Spinner 
} from '@chakra-ui/react';
import useAlert from '../../hooks/useAlert';
import API from '../../api/api';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/login', { email, password });
      dispatch(login(response.data.user));
      showAlert({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        description: '¡Bienvenido de vuelta!'
      });
      navigate('/home');
    } catch (error) {
      showAlert({
        title: 'Error al iniciar sesión',
        description: error.response?.data?.message || 'No se pudo iniciar sesión',
        status: 'error'
      });
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
