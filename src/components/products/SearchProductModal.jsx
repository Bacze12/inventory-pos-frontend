import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Button,
  VStack,
  Box,
  Text,
} from '@chakra-ui/react';

/**
 * Componente SearchProductModal
 * @param {boolean} isOpen - Controla si el modal está visible.
 * @param {Function} onClose - Función para cerrar el modal.
 * @param {Array} products - Lista de productos disponibles.
 * @param {Function} onSelect - Función que se ejecuta al seleccionar un producto.
 */
const SearchProductModal = ({ isOpen, onClose, products, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtra los productos según el texto ingresado en la búsqueda
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Buscar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Campo de búsqueda */}
          <Input
            placeholder="Escribe para buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            mb={4}
          />
          <VStack spacing={3} align="stretch">
            {filteredProducts.map((product) => (
              <Box
                key={product.id}
                p={3}
                bg="gray.50"
                _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                borderRadius="md"
                onClick={() => {
                  onSelect(product);
                  onClose();
                }}
              >
                <Text fontWeight="bold">{product.name}</Text>
                <Text fontSize="sm" color="gray.600">
                  ${product.price.toFixed(2)}
                </Text>
              </Box>
            ))}
            {filteredProducts.length === 0 && (
              <Text textAlign="center" color="gray.500">
                No se encontraron productos.
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchProductModal;
