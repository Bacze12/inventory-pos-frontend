import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { Trash } from 'lucide-react';

/**
 * Componente Cart
 * @param {Array} items - Lista de productos en el carrito.
 * @param {Function} onRemoveItem - Función para eliminar un producto del carrito.
 * @param {Function} onCheckout - Función para realizar el pago.
 */
const Cart = ({ items = [], onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box
      bg="white"
      borderRadius="md"
      shadow="sm"
      p={4}
      w="full"
      maxW="400px"
      h="auto"
    >
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Carrito de Compras
      </Text>
      <VStack align="stretch" spacing={4}>
        {items.map((item) => (
          <HStack key={item.id} justify="space-between" w="full">
            <Box>
              <Text fontWeight="bold">{item.name}</Text>
              <Text fontSize="sm" color="gray.500">
                {item.quantity} x ${item.price.toFixed(2)}
              </Text>
            </Box>
            <IconButton
              icon={<Trash />}
              aria-label="Eliminar producto"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
            />
          </HStack>
        ))}
        {items.length === 0 && (
          <Text color="gray.500" textAlign="center">
            El carrito está vacío.
          </Text>
        )}
      </VStack>
      <Divider my={4} />
      <HStack justify="space-between">
        <Text fontWeight="bold">Total:</Text>
        <Text>${total.toFixed(2)}</Text>
      </HStack>
      <Button
        colorScheme="blue"
        mt={4}
        w="full"
        onClick={onCheckout}
        isDisabled={items.length === 0}
      >
        Pagar
      </Button>
    </Box>
  );
};

export default Cart;
