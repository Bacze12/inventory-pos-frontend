// src/pages/CashClosing.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Divider,
} from '@chakra-ui/react';
import { useCash } from '../../context/CashContext';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const CashClosing = () => {
  const [cashSummary, setCashSummary] = useState({
    bills: [
      { denomination: 20000, count: 0, total: 0 },
      { denomination: 10000, count: 0, total: 0 },
      { denomination: 5000, count: 0, total: 0 },
      { denomination: 2000, count: 0, total: 0 },
    ],
    coins: [
      { denomination: 1000, count: 0, total: 0 },
      { denomination: 500, count: 0, total: 0 },
    ],
  });
  const [salesSummary, setSalesSummary] = useState({
    cashSales: 0,
    debitSales: 0,
    creditSales: 0,
    transferSales: 0,
    cashOpening: 0,
    cashIn: 0,
    cashOut: 0,
  });
  const toast = useToast();
  const navigate = useNavigate();
  const { closeCash } = useCash();

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        const response = await API.get('/sales-summary');
        setSalesSummary(response.data);
      } catch (error) {
        toast({
          title: "Error al cargar el resumen de ventas.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchSalesSummary();
  }, [toast]);

  const handleCountChange = (denomination, value) => {
    setCashSummary((prev) => ({
      ...prev,
      bills: prev.bills.map((bill) =>
        bill.denomination === denomination
          ? { ...bill, count: Number(value), total: Number(value) * bill.denomination }
          : bill
      ),
      coins: prev.coins.map((coin) =>
        coin.denomination === denomination
          ? { ...coin, count: Number(value), total: Number(value) * coin.denomination }
          : coin
      ),
    }));
  };

  const calculateTotalCash = () => {
    const billsTotal = cashSummary.bills.reduce((acc, bill) => acc + bill.total, 0);
    const coinsTotal = cashSummary.coins.reduce((acc, coin) => acc + coin.total, 0);
    return billsTotal + coinsTotal;
  };

  const totalCash = calculateTotalCash();

  const handleConfirmClose = async () => {
    try {
        await API.post('/cash-drawer', {
        shiftId: 1, // MODIFICAR para que se pueda reemplazar con el ID del turno actual
        type: 'FINAL_CASH',
        amount: totalCash,
        reason: 'Cierre de caja',
      });
      toast({
        title: "Caja cerrada exitosamente.",
        description: `Monto final: $${totalCash.toLocaleString()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      closeCash();
      navigate('/pos');
    } catch (error) {
      toast({
        title: "Error al cerrar la caja.",
        description: error.response?.data?.message || 'Intenta nuevamente.',
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Cierre de Caja #1
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Conteo de Efectivo */}
        <Box
          bg="white"
          shadow="sm"
          borderRadius="md"
          p={6}
          border="1px solid"
          borderColor="gray.200"
        >
          <Heading size="md" mb={4}>
            Conteo de Efectivo
          </Heading>
          <Divider mb={4} />
          <VStack align="stretch" spacing={4}>
            <Heading size="sm">Billetes</Heading>
            {cashSummary.bills.map((bill) => (
              <HStack key={bill.denomination}>
                <Text>${bill.denomination.toLocaleString()} x</Text>
                <Input
                  type="number"
                  value={bill.count}
                  onChange={(e) => handleCountChange(bill.denomination, e.target.value)}
                />
                <Text>${bill.total.toLocaleString()}</Text>
              </HStack>
            ))}

            <Heading size="sm" mt={4}>
              Monedas
            </Heading>
            {cashSummary.coins.map((coin) => (
              <HStack key={coin.denomination}>
                <Text>${coin.denomination.toLocaleString()} x</Text>
                <Input
                  type="number"
                  value={coin.count}
                  onChange={(e) => handleCountChange(coin.denomination, e.target.value)}
                />
                <Text>${coin.total.toLocaleString()}</Text>
              </HStack>
            ))}

            <Divider />
            <Text fontWeight="bold" fontSize="lg" textAlign="right">
              Total Contado: ${totalCash.toLocaleString()}
            </Text>
          </VStack>
        </Box>

        {/* Resumen de Ventas */}
        <Box
          bg="white"
          shadow="sm"
          borderRadius="md"
          p={6}
          border="1px solid"
          borderColor="gray.200"
        >
          <Heading size="md" mb={4}>
            Resumen de Ventas
          </Heading>
          <Divider mb={4} />
          <VStack align="stretch" spacing={4}>
            <Text>
              Ventas en Efectivo{' '}
              <span style={{ float: 'right' }}>${salesSummary.cashSales.toLocaleString()}</span>
            </Text>
            <Text>
              Ventas con Débito{' '}
              <span style={{ float: 'right' }}>${salesSummary.debitSales.toLocaleString()}</span>
            </Text>
            <Text>
              Ventas con Crédito{' '}
              <span style={{ float: 'right' }}>${salesSummary.creditSales.toLocaleString()}</span>
            </Text>
            <Text>
              Ventas por Transferencia{' '}
              <span style={{ float: 'right' }}>${salesSummary.transferSales.toLocaleString()}</span>
            </Text>
            <Divider />
            <Text>
              Apertura de Caja{' '}
              <span style={{ float: 'right' }}>${salesSummary.cashOpening.toLocaleString()}</span>
            </Text>
            <Text>
              Ingresos de Efectivo{' '}
              <span style={{ float: 'right', color: 'green' }}>
                +${salesSummary.cashIn.toLocaleString()}
              </span>
            </Text>
            <Text>
              Retiros de Caja{' '}
              <span style={{ float: 'right', color: 'red' }}>
                ${salesSummary.cashOut.toLocaleString()}
              </span>
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Botones */}
      <Flex justify="space-between" mt={6}>
        <Button variant="outline" onClick={() => navigate('/pos')}>Cancelar</Button>
        <Button colorScheme="blue" onClick={handleConfirmClose}>
          Confirmar Cierre
        </Button>
      </Flex>
    </Box>
  );
};

export default CashClosing;