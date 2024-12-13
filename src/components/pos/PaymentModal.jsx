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
  Select,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";

const PaymentModal = ({ isOpen, onClose, total, onPayment, paymentMethod, setPaymentMethod }) => {
  const [amountReceived, setAmountReceived] = useState(0);

  const change = Math.max(amountReceived - total, 0);

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
        <ModalHeader>Process Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            <Text fontSize="lg">Total: ${total}</Text>
          </Box>
          <Box mb={4}>
            <Text mb={2}>Payment Method:</Text>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Transfer</option>
            </Select>
          </Box>
          <Box mb={4}>
            <Text mb={2}>Amount Received:</Text>
            <Input
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(Number(e.target.value))}
              placeholder="Enter amount received"
            />
          </Box>
          <Flex justify="space-between" mt={4}>
            <Text>Change: ${change}</Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleConfirmPayment}>
            Confirm Payment
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
