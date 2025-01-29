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
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import API from '../../api/api';
import { createProduct, updateProduct } from '../../api/products';

const ProductModal = ({ initialData, isOpen, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || '');
  const [grossCost, setGrossCost] = useState(initialData?.grossCost || '');
  const [netSalePrice, setNetSalePrice] = useState(initialData?.netSalePrice || '');
  const [grossSalePrice, setGrossSalePrice] = useState(initialData?.grossSalePrice || '');
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [hasExtraTax, setHasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const toast = useToast();

  // Cargar categorías y proveedores
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

  const handlePurchasePriceChange = (value) => {
    const purchase = Math.ceil(parseFloat(value));
    setPurchasePrice(purchase);
    const gross = Math.ceil(purchase * 1.19);
    setGrossCost(gross);
  };

  const handleGrossCostChange = (value) => {
    const gross = Math.ceil(parseFloat(value));
    setGrossCost(gross);
    const purchase = Math.ceil(gross / 1.19);
    setPurchasePrice(purchase);
  };

  const handleNetSalePriceChange = (value) => {
    const netSale = Math.ceil(parseFloat(value));
    setNetSalePrice(netSale);
  };

  const handleGrossSalePriceChange = (value) => {
    const grossSale = Math.ceil(parseFloat(value));
    setGrossSalePrice(grossSale);
    const netSale = Math.ceil(grossSale / 1.19);
    setNetSalePrice(netSale);
    const margin = grossCost > 0 ? Math.ceil(((grossSale / grossCost) * 100) - 100) : 0;
    setMarginPercent(margin);
  };

  const handleMarginChange = (value) => {
    const margin = Math.ceil(parseFloat(value) || 0);
    setMarginPercent(margin);
    const netSale = Math.ceil(purchasePrice * (1 + margin / 100));
    setNetSalePrice(netSale);
    const grossSale = hasExtraTax ? Math.ceil(netSale * 1.19) : netSale;
    setGrossSalePrice(grossSale);
  };

  const handleSubmit = async () => {
    if (!name || !sku || !purchasePrice || !grossSalePrice || !stock || !categoryId || !supplierId) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      const response = await API.get(`/products?sku=${sku}`);
      if (response.data.length > 0) {
        alert('El código de barras ya existe.');
        return;
      }
    } catch (error) {
      toast({
        title: 'Error al verificar el SKU',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const productData = {
      name,
      sku,
      purchasePrice: parseInt(purchasePrice, 10),
      grossCost: parseInt(grossCost, 10),
      netSalePrice: parseInt(netSalePrice, 10),
      grossSalePrice: parseInt(grossSalePrice, 10),
      marginPercent: parseInt(marginPercent, 10),
      stock: parseInt(stock, 10),
      categoryId,
      supplier: supplierId,
      hasExtraTax,
      isIvaExempt,
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
      <ModalContent maxW="40%">
        <ModalHeader>{initialData ? 'Editar Producto' : 'Agregar Producto'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={2} spacing={5} mb={4}>
            <FormControl mb={4}>
              <FormLabel>Nombre *</FormLabel>
              <Input value={name} required onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Codigo de Barras *</FormLabel>
              <Input value={sku} required onChange={(e) => setSku(e.target.value)} />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={2} spacing={5} mb={4}>
            <FormControl>
              <FormLabel>Categoría *</FormLabel>
              <Select
                placeholder="Seleccionar"
                value={categoryId}
                required
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
              <FormLabel>Proveedor *</FormLabel>
              <Select
                placeholder="Seleccionar"
                value={supplierId}
                required
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
          <SimpleGrid columns={2} spacing={5} mb={4}>
            <FormControl>
              <FormLabel>Costo Neto *</FormLabel>
              <Input
                type="number"
                value={purchasePrice}
                placeholder="$0"
                required
                onChange={(e) => handlePurchasePriceChange(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Costo Bruto</FormLabel>
              <Input
                type="number"
                value={grossCost}
                placeholder="$0"
                onChange={(e) => handleGrossCostChange(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={3} spacing={5} mb={4}>
            <FormControl>
              <FormLabel>Venta Neto</FormLabel>
              <Input
                type="number"
                value={netSalePrice}
                placeholder="$0"
                onChange={(e) => handleNetSalePriceChange(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Margen (%)</FormLabel>
              <Input
                type="number"
                value={marginPercent}
                placeholder="0%"
                onChange={(e) => handleMarginChange(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Venta Bruto *</FormLabel>
              <Input
                type="number"
                value={grossSalePrice}
                placeholder="$0"
                required
                onChange={(e) => handleGrossSalePriceChange(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={2} spacing={5} mb={4}>
            <FormControl mb={4}>
              <Checkbox
                isChecked={hasExtraTax}
                onChange={(e) => setHasExtraTax(e.target.checked)}
              >
                Tiene Impuesto Extra
              </Checkbox>
            </FormControl>
            <FormControl mb={4}>
              <Checkbox
                isChecked={isIvaExempt}
                onChange={(e) => setIsIvaExempt(e.target.checked)}
              >
                Exento de IVA
              </Checkbox>
            </FormControl>
          </SimpleGrid>
          <FormControl mb={4}>
            <FormLabel>Stock *</FormLabel>
            <Input
              type="number"
              value={stock}
              placeholder="0"
              required
              onChange={(e) => setStock(e.target.value)}
            />
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
