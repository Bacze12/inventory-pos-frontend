import React from 'react';
import { Box, Button, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useForm } from '../../hooks/useForm';
import { useSales } from '../../hooks/useSales';

const AddSale = () => {
  const { createSale } = useSales();

  const validate = (values) => {
    const errors = {};
    if (!values.customer) errors.customer = 'El cliente es obligatorio.';
    if (!values.total) errors.total = 'El total es obligatorio.';
    else if (isNaN(values.total)) errors.total = 'Debe ser un número válido.';
    return errors;
  };

  const { values, errors, handleChange, handleSubmit, resetForm } = useForm(
    { customer: '', total: '' },
    validate
  );

  const onSubmit = async () => {
    const success = await createSale(values);
    if (success) resetForm();
  };

  return (
    <Box>
      <FormControl isInvalid={!!errors.customer} mb={4}>
        <FormLabel>Cliente</FormLabel>
        <Input
          name="customer"
          value={values.customer}
          onChange={handleChange}
          placeholder="Nombre del cliente"
        />
        <FormErrorMessage>{errors.customer}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.total} mb={4}>
        <FormLabel>Total</FormLabel>
        <Input
          name="total"
          value={values.total}
          onChange={handleChange}
          placeholder="Total de la venta"
        />
        <FormErrorMessage>{errors.total}</FormErrorMessage>
      </FormControl>

      <Button colorScheme="blue" onClick={handleSubmit(onSubmit)}>
        Agregar Venta
      </Button>
    </Box>
  );
};

export default AddSale;
