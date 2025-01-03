// src/pages/CashOpening.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const CashOpening = () => {
  const [initialAmount, setInitialAmount] = useState(100000);
  const [notes, setNotes] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleOpenCash = async () => {
    try {
      await API.post('/cash-drawer', {
        shiftId: 1, // MODIFICAR para que se pueda reemplazar con el ID del turno actual
        type: 'INITIAL_CASH',
        amount: initialAmount,
        reason: notes,
      });
      toast({
        title: "Caja abierta exitosamente.",
        description: `Monto inicial: $${initialAmount.toLocaleString()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/pos');
    } catch (error) {
      toast({
        title: "Error al abrir la caja.",
        description: error.response?.data?.message || 'Intenta nuevamente.',
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" align="center" p={6} bg="gray.50" minH="100vh">
      <Box
        bg="white"
        p={8}
        rounded="md"
        shadow="md"
        w="100%"
        maxW="500px"
        border="1px solid"
        borderColor="gray.200"
      >
        <Heading size="lg" mb={6} textAlign="center">
          Apertura de Caja
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={4} textAlign="center">
          {new Date().toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          - {new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
        </Text>

        <Box mb={6}>
          <Text fontWeight="bold" mb={2}>
            Monto Inicial
          </Text>
          <Input
            type="number"
            value={initialAmount}
            onChange={(e) => setInitialAmount(parseInt(e.target.value) || 0)}
            mb={4}
          />
        </Box>

        <Box mb={6}>
          <Text fontWeight="bold" mb={2}>
            Observaciones
          </Text>
          <Input
          placeholder="Notas adicionales"
          value={notes}
          onChange={(e) => setNotes(e.target.value)} />
        </Box>

        {/* Botones */}
        <HStack spacing={4} mt={4}>
          <Button variant="outline" width="50%" onClick={() => navigate('/pos')}>
            Cancelar
          </Button>
          <Button colorScheme="blue" width="50%" onClick={handleOpenCash}>
            Abrir Caja
          </Button>
        </HStack>
      </Box>
    </Flex>
  );
};

export default CashOpening;