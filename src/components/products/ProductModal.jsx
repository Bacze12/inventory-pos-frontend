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
} from '@chakra-ui/react';

const ProductModal = ({ initialData, isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || '');
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [hasExtraTax, setHasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [extraTaxRate, setExtraTaxRate] = useState(initialData?.extraTaxRate || '');
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [calculatedPrices, setCalculatedPrices] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}categories`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${API_URL}suppliers`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setSuppliers(data);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, [API_URL]);

  const fetchPreviewPrices = async () => {
    try {
      const response = await fetch(`${API_URL}products/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purchasePrice: parseFloat(purchasePrice) || 0,
          marginPercent: parseFloat(marginPercent) || 0,
          isIvaExempt,
          hasExtraTax,
          extraTaxRate: parseFloat(extraTaxRate) || 0,
        }),
      });
      const data = await response.json();
      setCalculatedPrices(data);
    } catch (error) {
      console.error('Error fetching preview prices:', error);
    }
  };

  const handleSubmit = async () => {
    const productData = {
      name,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0,
      marginPercent: marginPercent ? parseFloat(marginPercent) : 0,
      isIvaExempt,
      categoryId: categoryId ? parseInt(categoryId, 10) : null,
      supplierId: supplierId ? parseInt(supplierId, 10) : null,
    };

    try {
      await onSubmit(productData);
    } catch (error) {
      console.error('Error creating product:', error);
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
            <FormLabel>Nombre del Producto</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>SKU</FormLabel>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Precio de Compra</FormLabel>
            <Input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Porcentaje de Margen</FormLabel>
            <Input
              type="number"
              value={marginPercent}
              onChange={(e) => setMarginPercent(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
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
          <FormControl mb={4}>
            <Checkbox isChecked={isIvaExempt} onChange={(e) => setIsIvaExempt(e.target.checked)}>
              Exento de IVA
            </Checkbox>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Categoría</FormLabel>
            <Select
              placeholder="Selecciona una categoría"
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
          <FormControl mb={4}>
            <FormLabel>Proveedor</FormLabel>
            <Select
              placeholder="Selecciona un proveedor"
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
          <Button onClick={fetchPreviewPrices} colorScheme="teal" mb={4}>
            Calcular Precios
          </Button>
          {calculatedPrices && (
            <div>
              <p>Precio de Venta: {calculatedPrices.sellingPrice}</p>
              <p>Precio Mínimo: {calculatedPrices.minSellingPrice}</p>
              <p>Precio Final: {calculatedPrices.finalPrice}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            {initialData ? 'Guardar Cambios' : 'Agregar'}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
