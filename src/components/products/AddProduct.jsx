import React from 'react';
import { Box, Button, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useForm } from '../../hooks/useForm';
import { useProducts } from '../../hooks/useProducts';

const AddProduct = () => {
  const { handleAddProduct } = useProducts();
  const validate = (values) => {
    const errors = {};
    if (!values.name) errors.name = 'El nombre es obligatorio.';
    if (!values.price) errors.price = 'El precio es obligatorio.';
    else if (isNaN(values.price)) errors.price = 'Debe ser un número válido.';
    return errors;
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
    { name: '', price: '' },
    validate
  );

  const onSubmit = async () => {
    await handleAddProduct(values);
    resetForm();
  };

  return (
    <Box>
      <FormControl isInvalid={!!errors.name} mb={4}>
        <FormLabel>Nombre del Producto</FormLabel>
        <Input
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Ingresa el nombre"
        />
        <FormErrorMessage>{errors.name}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.price} mb={4}>
        <FormLabel>Precio</FormLabel>
        <Input
          name="price"
          value={values.price}
          onChange={handleChange}
          placeholder="Ingresa el precio"
        />
        <FormErrorMessage>{errors.price}</FormErrorMessage>
      </FormControl>

      <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
        Agregar Producto
      </Button>
    </Box>
  );
};

export default AddProduct;
