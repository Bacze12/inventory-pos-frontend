import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  VStack,
  Box,
} from '@chakra-ui/react';

/**
 * Componente PaymentModal
 * @param {boolean} isOpen - Si el modal está abierto.
 * @param {Function} onClose - Función para cerrar el modal.
 * @param {number} total - Monto total a pagar.
 * @param {Function} onPayment - Función que se ejecuta al confirmar el pago.
 */
const PaymentModal = ({ isOpen, onClose, total, onPayment }) => {
  const [amountReceived, setAmountReceived] = useState('');
  const toast = useToast();

  const handlePayment = () => {
    const received = parseFloat(amountReceived);
    if (isNaN(received) || received < total) {
      toast({
        title: 'Monto inválido',
        description: 'El monto recibido debe ser igual o mayor al total.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const change = received - total;
    onPayment(received, change);
    setAmountReceived('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Realizar Pago</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Total a Pagar</FormLabel>
              <Box p={2} bg="gray.100" borderRadius="md">
                <Text fontWeight="bold">${total.toFixed(2)}</Text>
              </Box>
            </FormControl>
            <FormControl>
              <FormLabel>Monto Recibido</FormLabel>
              <Input
                placeholder="Ingrese el monto recibido"
                type="number"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handlePayment}>
            Confirmar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
