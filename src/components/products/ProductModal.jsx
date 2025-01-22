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
  const [netCost, setNetCost] = useState(initialData?.netCost || '');
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
         setSuppliers(
        response.data.map((supplier) => ({
          id: supplier._id, // MongoDB usa _id como string
          name: supplier.name,
        }))
      );
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

  const handleNetCostChange = (value) => {
    const net = Math.ceil(parseFloat(value) || 0);
    setNetCost(net);
    const gross = hasExtraTax ? Math.ceil(net * 1.19) : net;
    setGrossCost(gross);
    const netSale = Math.ceil(net * (1 + marginPercent / 100));
    setNetSalePrice(netSale);
    const grossSale = hasExtraTax ? Math.ceil(netSale * 1.19) : netSale;
    setGrossSalePrice(grossSale);
  };

  const handleGrossCostChange = (value) => {
    const gross = Math.ceil(parseFloat(value) || 0);
    setGrossCost(gross);
    const net = hasExtraTax ? Math.ceil(gross / 1.19) : gross;
    setNetCost(net);
    const netSale = Math.ceil(net * (1 + marginPercent / 100));
    setNetSalePrice(netSale);
    const grossSale = hasExtraTax ? Math.ceil(netSale * 1.19) : netSale;
    setGrossSalePrice(grossSale);
  };

  const handleNetSalePriceChange = (value) => {
    const netSale = Math.ceil(parseFloat(value) || 0);
    setNetSalePrice(netSale);
    const grossSale = hasExtraTax ? Math.ceil(netSale * 1.19) : netSale;
    setGrossSalePrice(grossSale);
    const margin = netCost > 0 ? Math.ceil(((netSale - netCost) / netCost) * 100) : 0;
    setMarginPercent(margin);
  };

  const handleGrossSalePriceChange = (value) => {
    const grossSale = Math.ceil(parseFloat(value) || 0);
    setGrossSalePrice(grossSale);
    const netSale = hasExtraTax ? Math.ceil(grossSale / 1.19) : grossSale;
    setNetSalePrice(netSale);
    const margin = netCost > 0 ? Math.ceil(((netSale - netCost) / netCost) * 100) : 0;
    setMarginPercent(margin);
  };

  const handleMarginChange = (value) => {
    const margin = Math.ceil(parseFloat(value) || 0);
    setMarginPercent(margin);
    const netSale = Math.ceil(netCost * (1 + margin / 100));
    setNetSalePrice(netSale);
    const grossSale = hasExtraTax ? Math.ceil(netSale * 1.19) : netSale;
    setGrossSalePrice(grossSale);
  };

  const handleSubmit = async () => {
    const productData = {
      name,
      sku,
      netCost: parseInt(netCost, 10),
      grossCost: parseInt(grossCost, 10),
      netSalePrice: parseInt(netSalePrice, 10),
      grossSalePrice: parseInt(grossSalePrice, 10),
      marginPercent: parseInt(marginPercent, 10),
      stock: parseInt(stock, 10),
      categoryId,
      supplierId,
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
          <SimpleGrid columns={2} spacing={5} mb={4}>
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
          <SimpleGrid columns={3} spacing={5} mb={4}>
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
          <SimpleGrid columns={2} spacing={5} mb={4}>
            <FormControl>
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
            <FormControl>
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
          </SimpleGrid>
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
