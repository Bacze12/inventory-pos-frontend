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
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import axios from "axios";
import { CollapsibleSidebar } from "../../components/layout/CollapsibleSidebar";
import { Navbar } from "../../components/layout/Navbar";

const SalesModule = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Cargar productos desde el backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("Error al cargar productos. Por favor, inténtelo de nuevo más tarde.");
      }
    };

    fetchProducts();
  }, []);

  // Manejar cambios en la cantidad de productos
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

  // Calcular el subtotal de un producto
  const calculateSubtotal = (productId, price) => {
    return (cart[productId] || 0) * (price || 0);
  };

  // Calcular el total de la venta
  useEffect(() => {
    const newTotal = products.reduce((acc, product) => {
      return acc + calculateSubtotal(product.id, product.price);
    }, 0);
    setTotal(newTotal);
  }, [cart, products]);

  // Filtrar productos por código de barras o nombre
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? "240px" : "60px"} p={6}>
          <Flex mb={4} justify="space-between" align="center">
            <Input
              placeholder="Buscar producto o escanear código"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              width="400px"
            />
          </Flex>

          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Flex gap={6}>
            {/* Tabla de productos */}
            <Box
              flex="2"
              border="1px solid #E2E8F0"
              rounded="md"
              overflow="auto"
              maxH="400px" // Altura fija de la tabla
            >
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
                  {filteredProducts.map((product) => (
                    <Tr key={product.id}>
                      <Td>{product.barcode}</Td>
                      <Td>{product.name}</Td>
                      <Td isNumeric>${(product.price || 0).toFixed(2)}</Td>
                      <Td isNumeric>
                        <Flex align="center" justify="center">
                          <IconButton
                            size="xs"
                            icon={<MinusIcon />}
                            onClick={() => handleQuantityChange(product.id, -1)}
                            aria-label="Reduce quantity"
                          />
                          <Text mx={2}>{cart[product.id] || 0}</Text>
                          <IconButton
                            size="xs"
                            icon={<AddIcon />}
                            onClick={() => handleQuantityChange(product.id, 1)}
                            aria-label="Increase quantity"
                          />
                        </Flex>
                      </Td>
                      <Td isNumeric>
                        ${calculateSubtotal(product.id, product.price).toFixed(2)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            {/* Resumen de la venta */}
            <Box flex="1" border="1px solid #E2E8F0" rounded="md" p={4}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Venta Actual
              </Text>
              <Divider mb={4} />
              <Box>
                {Object.entries(cart).map(([productId, quantity]) => {
                  const product = products.find((p) => p.id === parseInt(productId));
                  if (!product || quantity === 0) return null;

                  return (
                    <Flex key={productId} justify="space-between" mb={2}>
                      <Text>{product.name}</Text>
                      <Text>
                        {quantity} x ${(product.price || 0).toFixed(2)} = $
                        {calculateSubtotal(productId, product.price).toFixed(2)}
                      </Text>
                    </Flex>
                  );
                })}
              </Box>
              <Divider my={4} />
              <Flex justify="space-between">
                <Text fontSize="lg" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="lg" fontWeight="bold">
                  ${total.toFixed(2)}
                </Text>
              </Flex>
              <Button colorScheme="blue" w="100%" mt={4}>
                Procesar Pago
              </Button>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default SalesModule;
