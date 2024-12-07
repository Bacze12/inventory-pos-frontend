import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import API from '../../api/api';

const AddSale = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      // Validación básica
      if (!productId.trim() || !quantity.trim()) {
        toast({
          title: 'Campos incompletos',
          description: 'Por favor, complete todos los campos.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const parsedQuantity = parseInt(quantity, 10);
      if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        toast({
          title: 'Cantidad inválida',
          description: 'Ingrese un número mayor a 0 para la cantidad.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Enviar solicitud al backend
      await API.post('/sales', { productId, quantity: parsedQuantity });

      // Mostrar notificación de éxito
      toast({
        title: 'Venta registrada',
        description: 'La venta se ha registrado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Limpiar campos después del éxito
      setProductId('');
      setQuantity('');
    } catch (err) {
      toast({
        title: 'Error al registrar la venta',
        description: 'No se pudo registrar la venta. Inténtelo nuevamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="md" shadow="sm">
      <FormControl mb={4}>
        <FormLabel>ID del Producto</FormLabel>
        <Input
          placeholder="Ingrese el ID del producto"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Cantidad</FormLabel>
        <Input
          placeholder="Ingrese la cantidad"
          value={quantity}
          type="number"
          onChange={(e) => setQuantity(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleSubmit}>
        Registrar Venta
      </Button>
    </Box>
  );
};

export default AddSale;
