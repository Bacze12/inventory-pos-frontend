import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCash } from '../../context/CashContext';

/**
 * OpenCashModal Component
 * @param {boolean} isOpen - Si el modal está abierto.
 * @param {function} onClose - Función para cerrar el modal.
 * @param {function} onConfirm - Función que se ejecuta con el monto inicial.
 */
export const OpenCashModal = ({ isOpen, onClose, onConfirm }) => {
  const [initialAmount, setInitialAmount] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { openCash } = useCash();

  const handleConfirm = () => {
    const numericAmount = parseFloat(initialAmount);

    if (isNaN(numericAmount) || numericAmount < 0) {
      toast({
        title: 'Monto inválido',
        description: 'Por favor, ingrese un monto inicial válido.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    openCash(numericAmount);
    onClose();
    navigate('/pos');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Abrir Caja</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Monto Inicial</FormLabel>
            <Input
              placeholder="Ingrese el monto inicial"
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleConfirm}>
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
