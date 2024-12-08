import React from 'react';
import { Box, Image, Text, VStack, HStack, Button } from '@chakra-ui/react';

/**
 * Componente ProductCard
 * @param {Object} product - Información del producto (id, name, price, image).
 * @param {Function} onAddToCart - Función que se ejecuta al agregar el producto al carrito.
 */
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      bg="white"
      shadow="sm"
      w="full"
    >
      <Image
        src={product.image || 'https://via.placeholder.com/150'}
        alt={product.name}
        borderRadius="md"
        mb={4}
      />
      <VStack spacing={2} align="stretch">
        <Text fontWeight="bold" fontSize="lg">
          {product.name}
        </Text>
        <HStack justify="space-between">
          <Text fontSize="md" color="gray.500">
            ${product.price.toFixed(2)}
          </Text>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => onAddToCart(product)}
          >
            Agregar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ProductCard;
