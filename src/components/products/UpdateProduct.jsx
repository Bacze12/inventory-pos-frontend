import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import API from '../../api/api';

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/products/${id}`);
        setName(response.data.name);
        setPrice(response.data.price.toString());
      } catch (err) {
        setError('Error al cargar los detalles del producto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const numericPrice = parseFloat(price);

      if (!name.trim() || isNaN(numericPrice) || numericPrice <= 0) {
        toast({
          title: 'Validación fallida',
          description: 'Ingrese un nombre válido y un precio mayor a 0.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await API.put(`/products/${id}`, { name, price: numericPrice });

      toast({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error al actualizar',
        description: 'No se pudo actualizar el producto. Inténtelo nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="md" shadow="sm">
      <FormControl mb={4}>
        <FormLabel>Nombre del Producto</FormLabel>
        <Input
          placeholder="Ingrese el nombre del producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Precio</FormLabel>
        <Input
          placeholder="Ingrese el precio del producto"
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleUpdate}>
        Actualizar Producto
      </Button>
    </Box>
  );
};

export default UpdateProduct;
