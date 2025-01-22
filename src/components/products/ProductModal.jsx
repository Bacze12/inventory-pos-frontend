import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../api/products';
import Quagga from 'quagga';
import { isMobile, isTablet } from 'react-device-detect';
import { FiCamera } from "react-icons/fi";
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
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [hasExtraTax, setHasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [extraTaxRate, setExtraTaxRate] = useState(initialData?.extraTaxRate || '');
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [sellingPrice, setSellingPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [grossCost, setGrossCost] = useState('');
  const [netCost, setNetCost] = useState('');
  const [netSalePrice, setNetSalePrice] = useState('');
  const [grossSalePrice, setGrossSalePrice] = useState('');
  const [isActive, setIsActive] = useState(initialData?.isActive || true);
  const toast = useToast();

  // Cálculo de precios dinámico
  useEffect(() => {
    if (purchasePrice && marginPercent) {
      const marginMultiplier = 1 + marginPercent / 100;
      const calculatedNetCost = parseFloat(purchasePrice);
      const calculatedGrossCost = calculatedNetCost * marginMultiplier;

      const calculatedNetSalePrice = calculatedGrossCost;
      const calculatedGrossSalePrice = isIvaExempt
        ? calculatedNetSalePrice
        : calculatedNetSalePrice * 1.19;

      setNetCost(calculatedNetCost.toFixed(2));
      setGrossCost(calculatedGrossCost.toFixed(2));
      setNetSalePrice(calculatedNetSalePrice.toFixed(2));
      setGrossSalePrice(calculatedGrossSalePrice.toFixed(2));
      setSellingPrice(calculatedGrossCost.toFixed(2));
      setFinalPrice(calculatedGrossSalePrice.toFixed(2));
    }
  }, [purchasePrice, marginPercent, isIvaExempt]);

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

  const handleSubmit = async () => {
    if (!name || !categoryId || !supplierId || !purchasePrice || !marginPercent) {
      toast({
        title: "Error de validación",
        description: "Todos los campos obligatorios deben ser completados.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const productData = {
      name,
      sku,
      purchasePrice: parseFloat(purchasePrice),
      marginPercent: parseFloat(marginPercent),
      hasExtraTax,
      extraTaxRate: parseFloat(extraTaxRate) || 0,
      sellingPrice: parseFloat(sellingPrice),
      finalPrice: parseFloat(finalPrice),
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
          title: "Producto guardado",
          description: "El producto se ha guardado con éxito.",
          status: "success",
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
        title: "Error al guardar el producto",
        description: error.message || "Ocurrió un error inesperado.",
        status: "error",
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
          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Código de Barra</FormLabel>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Costo Neto</FormLabel>
              <Input value={`$ ${netCost}`} isReadOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Costo Bruto</FormLabel>
              <Input value={`$ ${grossCost}`} isReadOnly />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Venta Neto</FormLabel>
              <Input value={`$ ${netSalePrice}`} isReadOnly />
            </FormControl>
            <FormControl>
              <FormLabel>Venta Bruto</FormLabel>
              <Input value={`$ ${grossSalePrice}`} isReadOnly />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Margen (%)</FormLabel>
              <Input
                type="number"
                value={marginPercent}
                onChange={(e) => setMarginPercent(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Precio de Compra</FormLabel>
              <Input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

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
