import React, { useState } from 'react';
import { Box, Input, Button, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import API from '../../api/api';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      // Validaciones básicas
      if (!name.trim() || !price.trim()) {
        toast({
          title: 'Campos incompletos',
          description: 'Por favor, complete todos los campos.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        toast({
          title: 'Precio inválido',
          description: 'Ingrese un precio válido mayor a 0.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Enviar solicitud al backend
      await API.post('/products', {
        name,
        price: numericPrice,
      });

      // Limpiar campos después del éxito
      setName('');
      setPrice('');

      toast({
        title: 'Producto añadido',
        description: 'El producto se ha añadido exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al añadir producto',
        description:
          error?.response?.data?.message || 'No se pudo añadir el producto. Inténtelo nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

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
      <Button colorScheme="blue" onClick={handleSubmit}>
        Añadir Producto
      </Button>
    </Box>
  );
};

export default AddProduct;
