import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Checkbox,
  Select,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import API from '../../api/api';

const ProductModal = ({ initialData, isOpen, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [costNet, setCostNet] = useState(initialData?.purchasePrice || '');
  const [costGross, setCostGross] = useState('');
  const [saleNet, setSaleNet] = useState('');
  const [saleGross, setSaleGross] = useState('');
  const [margin, setMargin] = useState('');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [hasExtraTax, setHasExtraTax] = useState(false);
  const [isIvaExempt, setIsIvaExempt] = useState(false);
  const toast = useToast();

  // Constants
  const IVA_RATE = 0.19; // 19%

  // Fetch categories and suppliers on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get('/categories');
        setCategories(response.data);
      } catch (error) {
        toast({
          title: 'Error al cargar categorías',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await API.get('/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        toast({
          title: 'Error al cargar proveedores',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, [toast]);

  // Recalculate values when inputs change
  useEffect(() => {
    if (costNet) {
      const net = parseFloat(costNet) || 0;
      const gross = isIvaExempt ? net : net * (1 + IVA_RATE);
      setCostGross(gross.toFixed(2));

      if (margin) {
        const marginRate = parseFloat(margin) / 100 || 0;
        const saleNetCalc = net * (1 + marginRate);
        const saleGrossCalc = isIvaExempt ? saleNetCalc : saleNetCalc * (1 + IVA_RATE);
        setSaleNet(saleNetCalc.toFixed(2));
        setSaleGross(saleGrossCalc.toFixed(2));
      }
    }
  }, [costNet, margin, isIvaExempt]);

  const handleCostGrossChange = (value) => {
    const gross = parseFloat(value) || 0;
    const net = isIvaExempt ? gross : gross / (1 + IVA_RATE);
    setCostNet(net.toFixed(2));
    setCostGross(value);
  };

  const handleSaleNetChange = (value) => {
    const net = parseFloat(value) || 0;
    const marginCalc = ((net / parseFloat(costNet || 1)) - 1) * 100;
    const gross = isIvaExempt ? net : net * (1 + IVA_RATE);
    setSaleNet(value);
    setSaleGross(gross.toFixed(2));
    setMargin(marginCalc.toFixed(2));
  };

  const handleSaleGrossChange = (value) => {
    const gross = parseFloat(value) || 0;
    const net = isIvaExempt ? gross : gross / (1 + IVA_RATE);
    const marginCalc = ((net / parseFloat(costNet || 1)) - 1) * 100;
    setSaleGross(value);
    setSaleNet(net.toFixed(2));
    setMargin(marginCalc.toFixed(2));
  };

  const handleMarginChange = (value) => {
    const marginRate = parseFloat(value) / 100 || 0;
    const net = parseFloat(costNet) || 0;
    const saleNetCalc = net * (1 + marginRate);
    const saleGrossCalc = isIvaExempt ? saleNetCalc : saleNetCalc * (1 + IVA_RATE);
    setMargin(value);
    setSaleNet(saleNetCalc.toFixed(2));
    setSaleGross(saleGrossCalc.toFixed(2));
  };

  const handleSubmit = async () => {
    const productData = {
      name,
      sku,
      purchasePrice: parseFloat(costNet),
      sellingPrice: parseFloat(saleNet),
      marginPercent: parseFloat(margin),
      stock: parseInt(stock, 10) || 0,
      categoryId,
      supplierId,
      isActive: true,
    };

    try {
      await createProduct(productData);
      toast({
        title: 'Producto guardado',
        description: 'El producto ha sido guardado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error al guardar el producto',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{initialData ? 'Editar Producto' : 'Agregar Producto'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>SKU</FormLabel>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </FormControl>
          <SimpleGrid columns={2} spacing={5}>
            <FormControl>
              <FormLabel>Costo Neto</FormLabel>
              <Input
                type="number"
                value={costNet}
                onChange={(e) => setCostNet(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Costo Bruto</FormLabel>
              <Input
                type="number"
                value={costGross}
                onChange={(e) => handleCostGrossChange(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={2} spacing={5}>
            <FormControl>
              <FormLabel>Venta Neto</FormLabel>
              <Input
                type="number"
                value={saleNet}
                onChange={(e) => handleSaleNetChange(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Venta Bruto</FormLabel>
              <Input
                type="number"
                value={saleGross}
                onChange={(e) => handleSaleGrossChange(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <FormControl mt={4}>
            <FormLabel>Margen (%)</FormLabel>
            <Input
              type="number"
              value={margin}
              onChange={(e) => handleMarginChange(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Stock</FormLabel>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Categoría</FormLabel>
            <Select
              placeholder="Seleccionar"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Proveedor</FormLabel>
            <Select
              placeholder="Seleccionar"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {initialData ? 'Guardar Cambios' : 'Agregar'}
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
