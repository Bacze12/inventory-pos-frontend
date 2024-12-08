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
    Spinner,
    Text,
    Link,
    useToast,
    } from '@chakra-ui/react';
    import authApi from '../../api/api';

    const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
        toast({
            title: 'Passwords do not match!',
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
        return;
        }
        setLoading(true);
        try {
        await authApi.post('/register', { email, password });
        toast({
            title: 'Registration successful!',
            description: 'You can now log in.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        navigate('/login');
        } catch (error) {
        toast({
            title: 'Registration failed!',
            description: error.response?.data?.message || 'Please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
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
        bgGradient="linear(to-r, purple.500, pink.500)"
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
            Registro
            </Heading>
            <form onSubmit={handleRegister}>
            <VStack spacing={4}>
                <FormControl id="email" isRequired>
                <FormLabel>Correo</FormLabel>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu correo"
                />
                </FormControl>
                <FormControl id="password" isRequired>
                <FormLabel>Contraseña</FormLabel>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Escribe tu contraseña"
                />
                </FormControl>
                <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                />
                </FormControl>
                <Button
                type="submit"
                colorScheme="pink"
                width="full"
                isLoading={loading}
                >
                {loading ? <Spinner size="sm" /> : 'registrar'}
                </Button>
            </VStack>
            </form>
            <Text mt={4} textAlign="center">
            Ya tienes un acuenta?{' '}
            <Link color="pink.500" onClick={() => navigate('/login')}>
                Inicio de Sesion
            </Link>
            </Text>
        </Box>
        </Box>
    );
};

export default RegisterPage;
