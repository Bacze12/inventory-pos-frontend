import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  IconButton,
  Text,
  Flex,
  Alert,
  AlertIcon,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import axios from "axios";
import CollapsibleSidebar from "../../components/layout/CollapsibleSidebar";
import  Navbar  from "../../components/layout/Navbar";
import PaymentModal from "../../components/pos/PaymentModal";

const SalesModule = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [sku, setSku] = useState("");
  const [total, setTotal] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleQuantityChange = (productId, delta) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (!newCart[productId]) {
        newCart[productId] = 0;
      }
      newCart[productId] = Math.max(newCart[productId] + delta, 0);
      return newCart;
    });
  };

  const calculateSubtotal = (productId, finalPrice) => {
    return (cart[productId] || 0) * (finalPrice || 0);
  };

  useEffect(() => {
    const newTotal = selectedProducts.reduce((acc, product) => {
      return acc + calculateSubtotal(product.id, product.finalPrice);
    }, 0);
    setTotal(newTotal);
  }, [cart, selectedProducts]);

  const handleSkuSearch = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}products`);
      const product = response.data.find((p) => p.sku === sku.trim());
      if (product) {
        if (!selectedProducts.some((p) => p.id === product.id)) {
          setSelectedProducts((prev) => [...prev, product]);
        }
        handleQuantityChange(product.id, 1);
        setSku("");
      } else {
        setError("Producto no encontrado. Verifique el SKU e intente nuevamente.");
      }
    } catch (error) {
      console.error("Error al buscar producto por SKU:", error);
      setError("Error al buscar producto. Por favor, inténtelo de nuevo.");
    }
  };

  const handleCreateSale = () => {
    onOpen();
  };

    // Procesa el pago y crea la venta
  const handlePayment = async () => {
    const saleItems = Object.entries(cart)
      .filter(([productId, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = selectedProducts.find((p) => p.id === parseInt(productId));
        if (!product) {
          console.error(`Producto con ID ${productId} no encontrado en productos seleccionados.`);
          return null;
        }
        return {
          productId: product.id,
          quantity,
          price: product.finalPrice,
        };
      })
      .filter((item) => item !== null);

    if (saleItems.length === 0) {
      setError("El carrito está vacío o contiene productos inválidos. Añade productos antes de procesar la venta.");
      setTimeout(() => setError(null), 3000); // Oculta el error después de 3 segundos
      return;
    }

    try {
      // Procesa la venta
      await axios.post(`${process.env.REACT_APP_API_URL}sales`, { items: saleItems });

      // Actualiza el stock de los productos vendidos
      for (const { productId, quantity } of saleItems) {
        await axios.post(`${process.env.REACT_APP_API_URL}inventory/movement`, {
          sku: selectedProducts.find((p) => p.id === productId).sku,
          quantity,
          type: "OUT", // Resta del stock
        });
      }

      setSuccess("Venta procesada con éxito.");
      setTimeout(() => setSuccess(null), 3000); // Oculta el mensaje de éxito después de 3 segundos
      setCart({});
      setSelectedProducts([]);
      onClose();
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      setError("Error al procesar la venta. Por favor, inténtelo de nuevo.");
      setTimeout(() => setError(null), 3000); // Oculta el error después de 3 segundos
    }
  };
  
  
  return (
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? "240px" : "60px"} p={6}>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          {success && (
            <Alert status="success" mb={4}>
              <AlertIcon />
              {success}
            </Alert>
          )}

          <Flex gap={6}>
            <Box flex="3" border="1px solid #E2E8F0" rounded="md" overflow="auto" maxH="500px">
              <Text fontSize="xl" fontWeight="bold" mb={4} borderBottom="1px solid #E2E8F0" pb={2} align="center">
                Productos Seleccionados
              </Text>
              {selectedProducts.length > 0 ? (
                <Table variant="simple" size="sm">
                  <Thead bg="gray.100" position="sticky" top="0" zIndex="1">
                    <Tr>
                      <Th>Código</Th>
                      <Th>Producto</Th>
                      <Th isNumeric>Precio</Th>
                      <Th isNumeric>Cant.</Th>
                      <Th isNumeric>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedProducts.map((product) => (
                      <Tr key={product.id}>
                        <Td>{product.sku}</Td>
                        <Td>{product.name}</Td>
                        <Td isNumeric>${(product.finalPrice || 0)}</Td>
                        <Td isNumeric>
                          <Flex align="center" justify="center">
                            <IconButton
                              size="xs"
                              icon={<MinusIcon />}
                              onClick={() => handleQuantityChange(product.id, -1)}
                              aria-label="Reduce quantity"
                            />
                            <Text mx={2}>{cart[product.id] || 0}</Text>
                          </Flex>
                        </Td>
                        <Td isNumeric>${calculateSubtotal(product.id, product.finalPrice)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Text align="center" py={4}>
                  No hay productos seleccionados.
                </Text>
              )}
            </Box>

            <Box flex="1" border="1px solid #E2E8F0" rounded="md" p={4} maxH="200px">
              <Flex mb={4} justify="space-between" align="center">
                <Input
                  placeholder="Buscar por SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSkuSearch()}
                  width="400px"
                />
                <Button colorScheme="blue" onClick={handleSkuSearch} ml={2}>
                  Añadir
                </Button>
              </Flex>
              <Divider my={4} />
              <Flex justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  ${total}
                </Text>
              </Flex>
              <Button colorScheme="blue" w="100%" mt={4} onClick={handleCreateSale}>
                Procesar Pago
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
      <PaymentModal
        isOpen={isOpen}
        onClose={onClose}
        total={total}
        onPayment={handlePayment}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
      />
    </Box>
  );
};

export default SalesModule;
