import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Text,
  Box,
  Grid,
} from "@chakra-ui/react";

const PaymentModal = ({ isOpen, onClose, total, onPayment, paymentMethod, setPaymentMethod }) => {
  const [amountReceived, setAmountReceived] = useState(0);

  const change = Math.max(amountReceived - total, 0);

  const quickAmounts = [50000, 40000, 30000];

  const handleConfirmPayment = () => {
    if (amountReceived < total) {
      alert("The received amount is less than the total!");
      return;
    }
    onPayment(amountReceived, change);
    setAmountReceived(0);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Pago</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontSize="lg">Total: ${total}</Text>
          </Box>
          <Box mb={4}>
            <Text mb={2} fontWeight="medium">Metodo de Pago:</Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={4}>
              <Button
                colorScheme={paymentMethod === 'cash' ? 'blue' : 'gray'}
                onClick={() => setPaymentMethod('cash')}
              >
                Efectivo
              </Button>
              <Button
                colorScheme={paymentMethod === 'card' ? 'blue' : 'gray'}
                onClick={() => setPaymentMethod('card')}
              >
                Tarjeta
              </Button>
              <Button
                colorScheme={paymentMethod === 'transfer' ? 'blue' : 'gray'}
                onClick={() => setPaymentMethod('transfer')}
              >
                Transferencia
              </Button>
            </Grid>
          </Box>
          {paymentMethod === 'cash' && (
            <>
          <Box mb={4}>
            <Text mb={2}>Monto recibido:</Text>
            <Input
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(Number(e.target.value))}
              placeholder="Ingresa el monto recibido"
            />
          </Box>

          <Box mb={4}>
            <Text mb={2} fontWeight="medium">
              Montos rápidos:
            </Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={4}>
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  onClick={() => setAmountReceived(amount)}
                  colorScheme="gray"
                >
                  ${amount.toLocaleString()}
                </Button>
              ))}
            </Grid>
          </Box>

          <Box mt={4} textAlign="center">
              <Text fontSize="xl" fontWeight="bold" color="green.500">
                Vuelto: ${change.toLocaleString()}
              </Text>
          </Box>
          </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar (ESC)
          </Button>
          <Button colorScheme="blue" onClick={handleConfirmPayment}>
            Confirmar Pago
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
