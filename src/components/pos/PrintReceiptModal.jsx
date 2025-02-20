import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import PrintReceiptModal from './PrintReceiptModal';

const SalesModule = () => {
  const [total] = useState(14589); // Total de la venta
  const [receivedAmount] = useState(15000); // Monto recibido
  const [change] = useState(411); // Cambio calculado
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: openPreview,
    onClose: closePreview,
  } = useDisclosure();

  return (
    <Box>
      {/* Botón para abrir el modal de confirmación de pago */}
      <Button colorScheme="blue" onClick={onOpen}>
        Confirmar Pago
      </Button>

      {/* Modal de confirmación de pago */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Procesar Pago</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              ¿Deseas confirmar el pago?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                onClose();
                openPreview(); // Abrir la vista previa de la boleta
              }}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de vista previa de la boleta */}
      <PrintReceiptModal
        isOpen={isPreviewOpen}
        onClose={closePreview}
        total={total}
        receivedAmount={receivedAmount}
        change={change}
      />
    </Box>
  );
};

export default SalesModule;
