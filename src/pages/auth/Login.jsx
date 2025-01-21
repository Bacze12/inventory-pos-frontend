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
  Spinner,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import useAlert from '../../hooks/useAlert';
import API from '../../api/api';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { Sun, Moon } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  const boxBg = useColorModeValue('white', 'gray.700');
  const boxColor = useColorModeValue('black', 'white');
  const bgGradient = useColorModeValue('linear(to-t, green.300, gray.50)', 'linear(to-t, green.500, gray.500)');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(loginStart());
      const response = await API.post('/auth/login', { businessName, email, password });
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error('Respuesta del servidor incompleta');
    }
      
      // Guardar el token
      localStorage.setItem('token', token);
      
      // Actualizar el estado de Redux
      dispatch(loginSuccess(user));
      
      showAlert({
        title: 'Inicio de sesión exitoso',
        status: 'success',
        description: '¡Bienvenido de vuelta!'
      });
      navigate('/home');

    } catch (error) {
      dispatch(loginFailure(error.message));
      showAlert({
        title: 'Error al iniciar sesión',
        description: error.response?.data?.message || 'Credenciales incorrectas',
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
      bgGradient={bgGradient}
    >
      <IconButton
        position="absolute"
        top="1rem"
        right="1rem"
        icon={colorMode === 'light' ? <Moon /> : <Sun />}
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="toggle theme"
      />
      <Box
        p={8}
        rounded="md"
        shadow="lg"
        maxWidth="400px"
        w="full"
        bg={boxBg}
        color={boxColor}
      >
        <Heading as="h1" size="lg" textAlign="center" mb={6}>
          Inicio de Sesion
        </Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl id="businessName" isRequired>
              <FormLabel>BusinessName</FormLabel>
              <Input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Escriba su BusinessName"
              />
            </FormControl>
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
              colorScheme="green"
              width="full"
              isLoading={loading}
            >
              {loading ? <Spinner size="sm" /> : 'Ingresar'}
            </Button>
          </VStack>
        </form>
        <Text mt={4} textAlign="center">
          ¿Se te olvido la contraseña?{' '}
          <Link color="green.500" onClick={() => navigate('/recover-password')}>
            Recuperar contraseña
          </Link>
        </Text>
        <Text mt={2} textAlign="center">
          ¿No tienes una cuenta?{' '}
          <Link color="green.500" onClick={() => navigate('/register')}>
            Registrate
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default LoginPage;
