import React, { useState } from 'react';
import {
    Input,
    Select,
    Textarea,
    Heading,
    Box,
    Flex,
    FormControl,
    FormLabel,
    Button,
    Grid,
    Alert,
    AlertIcon,
} from "@chakra-ui/react";
import NavBar from '../../components/layout/Navbar';
import CollapsibleSidebar from '../../components/layout/CollapsibleSidebar';

const SettingsPage = () => {
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState(localStorage.getItem('selectedPrinter') || '');
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [error, setError] = useState(null);

    const handlePrinterChange = (event) => {
        const printer = event.target.value;
        setSelectedPrinter(printer);
        localStorage.setItem('selectedPrinter', printer);
    };

    const handleGetPrinters = async () => {
        try {
            const devices = await navigator.usb.requestDevice({ filters: [{ vendorId: 0x1234 }] });
            setPrinters(devices.map(device => device.productName));
        } catch (err) {
            setError(`Error al obtener las impresoras: ${err.message}`);
        }
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <Box bg="gray.50" minH="100vh">
            <NavBar onMenuClick={toggleSidebar} />
            <Flex>
                <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
                <Box flex="1" ml={isSidebarOpen ? '0px' : '0px'} p={6}>
                    {error && (
                            <Alert status="error" mb={4}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}
                    <Heading as="h1" size="lg" mb={6}>
                        Configuración
                    </Heading>
                    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                        {/* Información de la Empresa */}
                        <Box borderWidth="1px" borderRadius="lg" p={4}>
                            <Heading size="md" mb={4}>Información de la Empresa</Heading>
                            <FormControl mb={4}>
                                <FormLabel>Nombre de la Empresa</FormLabel>
                                <Input placeholder="Nombre Empresa" />
                            </FormControl>
                            <FormControl>
                                <FormLabel>RUT</FormLabel>
                                <Input placeholder="76543210-K" />
                            </FormControl>
                        </Box>

                        {/* Configuración POS */}
                        <Box borderWidth="1px" borderRadius="lg" p={4}>
                            <Heading size="md" mb={4}>Configuración POS</Heading>
                            <FormControl mb={4}>
                                <FormLabel>Impresora predeterminada</FormLabel>
                                <Button onClick={handleGetPrinters}>Seleccionar Impresora</Button>
                                <Select value={selectedPrinter} onChange={handlePrinterChange}>
                                    {printers.map((printer, index) => (
                                        <option key={index} value={printer}>{printer}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Formato de ticket</FormLabel>
                                <Select>
                                    <option>80mm</option>
                                    <option>58mm</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Mensaje de pie de ticket</FormLabel>
                                <Textarea placeholder="¡Gracias por su compra!" />
                            </FormControl>
                        </Box>

                        {/* Usuarios y Permisos */}
                        <Box borderWidth="1px" borderRadius="lg" p={4}>
                            <Heading size="md" mb={4}>Usuarios y Permisos</Heading>
                            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                                <Box>
                                    <Heading size="sm">Juan Pérez</Heading>
                                    <Box fontSize="sm">Administrador</Box>
                                </Box>
                                <Button size="sm" colorScheme="blue">Editar</Button>
                            </Flex>
                        </Box>
                    </Grid>
                    <Flex justifyContent="flex-end" mt={6}>
                        <Button colorScheme="blue">Guardar Cambios</Button>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

export default SettingsPage;
