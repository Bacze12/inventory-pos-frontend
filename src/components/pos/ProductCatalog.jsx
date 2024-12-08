import React from 'react';
import { Box, Input, SimpleGrid } from '@chakra-ui/react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';

const ProductCatalog = () => {
  const { filteredProducts, query, setQuery } = useProducts();

  return (
    <Box>
      <Input
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        mb={4}
      />
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ProductCatalog;
