import React, { useState } from 'react';
import { SimpleGrid, Input, VStack, Box } from '@chakra-ui/react';
import ProductCard from './ProductCard';

/**
 * Componente ProductCatalog
 * @param {Array} products - Lista de productos disponibles.
 * @param {Function} onAddToCart - Función que se ejecuta al agregar un producto al carrito.
 */
const ProductCatalog = ({ products, onAddToCart }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra los productos según el texto ingresado en la búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <VStack spacing={4} align="stretch">
      {/* Barra de búsqueda */}
      <Box>
        <Input
          placeholder="Buscar producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Catálogo de productos */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </SimpleGrid>

      {/* Mensaje si no hay productos que coincidan */}
      {filteredProducts.length === 0 && (
        <Box textAlign="center" color="gray.500">
          No se encontraron productos.
        </Box>
      )}
    </VStack>
  );
};

export default ProductCatalog;
