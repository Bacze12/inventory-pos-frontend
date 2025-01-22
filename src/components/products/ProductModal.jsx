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
  const [netCost, setNetCost] = useState(initialData?.purchasePrice || '');
  const [grossCost, setGrossCost] = useState('');
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [netSalePrice, setNetSalePrice] = useState('');
  const [grossSalePrice, setGrossSalePrice] = useState('');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const [hasExtraTax, setHasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [extraTaxRate, setExtraTaxRate] = useState(initialData?.extraTaxRate || '');
  const [isActive, setIsActive] = useState(initialData?.isActive || true);
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

  // Recalcular valores al perder el foco
  const recalculateValues = (field) => {
    const net = parseFloat(netCost) || 0;
    const margin = parseFloat(marginPercent) / 100 || 0;
    const gross = parseFloat(grossCost) || 0;
    const saleNet = parseFloat(netSalePrice) || 0;
    const saleGross = parseFloat(grossSalePrice) || 0;

    if (field === 'netCost') {
      const newGrossCost = net * (1 + margin);
      const newNetSale = newGrossCost;
      const newGrossSale = isIvaExempt ? newNetSale : newNetSale * 1.19;
      setGrossCost(newGrossCost.toFixed(2));
      setNetSalePrice(newNetSale.toFixed(2));
      setGrossSalePrice(newGrossSale.toFixed(2));
    } else if (field === 'marginPercent') {
      const newGrossCost = net * (1 + margin);
      const newNetSale = newGrossCost;
      const newGrossSale = isIvaExempt ? newNetSale : newNetSale * 1.19;
      setGrossCost(newGrossCost.toFixed(2));
      setNetSalePrice(newNetSale.toFixed(2));
      setGrossSalePrice(newGrossSale.toFixed(2));
    } else if (field === 'grossSalePrice') {
      const newNetSale = isIvaExempt ? saleGross : saleGross / 1.19;
      const newGrossCost = newNetSale;
      const newNetCost = newGrossCost / (1 + margin);
      setNetSalePrice(newNetSale.toFixed(2));
      setGrossCost(newGrossCost.toFixed(2));
      setNetCost(newNetCost.toFixed(2));
    }
  };

  const handleSubmit = async () => {
    if (!name || !categoryId || !supplierId || !netCost || !marginPercent) {
      toast({
        title: 'Error de validación',
        description: 'Todos los campos obligatorios deben ser completados.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const productData = {
      name,
      sku,
      purchasePrice: parseFloat(netCost),
      marginPercent: parseFloat(marginPercent),
      hasExtraTax,
      extraTaxRate: parseFloat(extraTaxRate) || 0,
      stock: parseInt(stock, 10),
      isIvaExempt,
      isActive,
      categoryId,
      supplier: supplierId,
    };

    try {
      const response = initialData
        ? await updateProduct(initialData.id, productData)
        : await createProduct(productData);

      if (response && response._id) {
        toast({
          title: 'Producto guardado',
          description: 'El producto se ha guardado con éxito.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onClose();
      } else {
        throw new Error('Error inesperado en la respuesta del backend.');
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);

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
          {/* Inputs para datos */}
          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Costo Neto</FormLabel>
              <Input
                type="number"
                value={netCost}
                onBlur={() => recalculateValues('netCost')}
                onChange={(e) => setNetCost(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Costo Bruto</FormLabel>
              <Input
                type="number"
                value={grossCost}
                onBlur={() => recalculateValues('grossCost')}
                onChange={(e) => setGrossCost(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Venta Neto</FormLabel>
              <Input
                type="number"
                value={netSalePrice}
                onBlur={() => recalculateValues('netSalePrice')}
                onChange={(e) => setNetSalePrice(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Venta Bruto</FormLabel>
              <Input
                type="number"
                value={grossSalePrice}
                onBlur={() => recalculateValues('grossSalePrice')}
                onChange={(e) => setGrossSalePrice(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Margen (%)</FormLabel>
              <Input
                type="number"
                value={marginPercent}
                onBlur={() => recalculateValues('marginPercent')}
                onChange={(e) => setMarginPercent(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Stock</FormLabel>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>
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
          <FormControl>
            <Checkbox isChecked={hasExtraTax} onChange={(e) => setHasExtraTax(e.target.checked)}>
              Tiene Impuesto Extra
            </Checkbox>
          </FormControl>
          {hasExtraTax && (
            <FormControl mb={4}>
              <FormLabel>Tasa de Impuesto Extra</FormLabel>
              <Input
                type="number"
                value={extraTaxRate}
                onChange={(e) => setExtraTaxRate(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl>
            <Checkbox isChecked={isIvaExempt} onChange={(e) => setIsIvaExempt(e.target.checked)}>
              Exento de IVA
            </Checkbox>
          </FormControl>
          <FormControl>
            <Checkbox isChecked={isActive} onChange={(e) => setIsActive(e.target.checked)}>
              Activo
            </Checkbox>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit} colorScheme="blue">
            Guardar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
