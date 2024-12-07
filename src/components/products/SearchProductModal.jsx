import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input, SimpleGrid } from '@chakra-ui/react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';

const SearchProductModal = ({ isOpen, onClose }) => {
  const { filteredProducts, query, setQuery } = useProducts();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buscar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            mb={4}
          />
          <SimpleGrid columns={[1, 2]} spacing={4}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchProductModal;
