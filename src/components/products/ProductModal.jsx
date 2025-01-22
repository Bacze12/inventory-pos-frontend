import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../api/products';
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
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import API from '../../api/api';

const ProductModal = ({ initialData, isOpen, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || '');
  const [netCost, setNetCost] = useState(initialData?.purchasePrice || '');
  const [grossCost, setGrossCost] = useState('');
  const [netSalePrice, setNetSalePrice] = useState('');
  const [grossSalePrice, setGrossSalePrice] = useState('');
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [hasExtraTax, setHasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [extraTaxRate, setExtraTaxRate] = useState(initialData?.extraTaxRate || '');
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const toast = useToast();

  // Load categories and suppliers
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

  // Dynamic calculations
  const handleNetCostChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setNetCost(parsedValue);
    const gross = isIvaExempt ? parsedValue : parsedValue * 1.19;
    setGrossCost(gross.toFixed(2));
    if (marginPercent) {
      const netSale = parsedValue * (1 + marginPercent / 100);
      setNetSalePrice(netSale.toFixed(2));
      const grossSale = hasExtraTax
        ? netSale * (1 + extraTaxRate / 100)
        : netSale;
      setGrossSalePrice(grossSale.toFixed(2));
    }
  };

  const handleGrossCostChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setGrossCost(parsedValue);
    const net = isIvaExempt ? parsedValue : parsedValue / 1.19;
    setNetCost(net.toFixed(2));
  };

  const handleNetSalePriceChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setNetSalePrice(parsedValue);
    const cost = parseFloat(netCost) || 0;
    const margin = ((parsedValue - cost) / cost) * 100;
    setMarginPercent(margin.toFixed(2));
    const grossSale = hasExtraTax
      ? parsedValue * (1 + extraTaxRate / 100)
      : parsedValue;
    setGrossSalePrice(grossSale.toFixed(2));
  };

  const handleGrossSalePriceChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setGrossSalePrice(parsedValue);
    const netSale = hasExtraTax
      ? parsedValue / (1 + extraTaxRate / 100)
      : parsedValue;
    setNetSalePrice(netSale.toFixed(2));
    const cost = parseFloat(netCost) || 0;
    const margin = ((netSale - cost) / cost) * 100;
    setMarginPercent(margin.toFixed(2));
  };

  const handleMarginChange = (value) => {
    const parsedValue = parseFloat(value) || 0;
    setMarginPercent(parsedValue);
    const cost = parseFloat(netCost) || 0;
    const netSale = cost * (1 + parsedValue / 100);
    setNetSalePrice(netSale.toFixed(2));
    const grossSale = hasExtraTax
      ? netSale * (1 + extraTaxRate / 100)
      : netSale;
    setGrossSalePrice(grossSale.toFixed(2));
  };

  const handleSubmit = async () => {
    const productData = {
      name,
      sku,
      purchasePrice: parseFloat(netCost),
      marginPercent: parseFloat(marginPercent),
      hasExtraTax,
      extraTaxRate: hasExtraTax ? parseFloat(extraTaxRate) : 0,
      sellingPrice: parseFloat(netSalePrice),
      finalPrice: parseFloat(grossSalePrice),
      isIvaExempt,
      stock: parseInt(stock, 10),
      categoryId,
      supplier: supplierId,
    };

    try {
      if (initialData) {
        await updateProduct(initialData.id, productData);
      } else {
        await createProduct(productData);
      }
      toast({
        title: 'Producto guardado',
        description: 'El producto se ha guardado con éxito.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error al guardar el producto',
        description: error.message || 'Ocurrió un error inesperado.',
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
          <SimpleGrid columns={2} spacing={4} mb={4}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>SKU</FormLabel>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={4} mb={4}>
            <FormControl>
              <FormLabel>Costo Neto</FormLabel>
              <Input
                type="number"
                value={netCost}
                onChange={(e) => handleNetCostChange(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Costo Bruto</FormLabel>
              <Input
                type="number"
                value={grossCost}
                onChange={(e) => handleGrossCostChange(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={3} spacing={4} mb={4}>
            <FormControl>
              <FormLabel>Venta Neto</FormLabel>
              <Input
                type="number"
                value={netSalePrice}
                onChange={(e) => handleNetSalePriceChange(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Venta Bruto</FormLabel>
              <Input
                type="number"
                value={grossSalePrice}
                onChange={(e) => handleGrossSalePriceChange(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Margen (%)</FormLabel>
              <Input
                type="number"
                value={marginPercent}
                onChange={(e) => handleMarginChange(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl mb={4}>
            <FormLabel>Stock</FormLabel>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </FormControl>

          <SimpleGrid columns={2} spacing={4} mb={4}>
            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select
                placeholder="Seleccionar"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Proveedor</FormLabel>
              <Select
                placeholder="Seleccionar"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <FormControl mb={4}>
            <Checkbox
              isChecked={hasExtraTax}
              onChange={(e) => setHasExtraTax(e.target.checked)}
            >
              Tiene Impuesto Extra
            </Checkbox>
          </FormControl>
          {hasExtraTax && (
            <FormControl mb={4}>
              <FormLabel>Tasa Extra (%)</FormLabel>
              <Input
                type="number"
                value={extraTaxRate}
                onChange={(e) => setExtraTaxRate(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl mb={4}>
            <Checkbox
              isChecked={isIvaExempt}
              onChange={(e) => setIsIvaExempt(e.target.checked)}
            >
              Exento de IVA
            </Checkbox>
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
