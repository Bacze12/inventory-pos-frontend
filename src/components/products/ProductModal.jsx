import React, { useState, useEffect, useCallback } from 'react';
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
  const [sellingPrice, setSellingPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const toast = useToast();

  const handleMarginChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setMarginPercent(value);
    }
  };

  const handlePurchasePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setPurchasePrice(value);
    }
  };

  useEffect(() => {
    if (purchasePrice && marginPercent) {
      const marginMultiplier = 1 + marginPercent / 100;
      const calculatedSellingPrice = purchasePrice * marginMultiplier;
      const calculatedFinalPrice = isIvaExempt
        ? calculatedSellingPrice
        : calculatedSellingPrice * 1.19;

      const calculatedExtraTax = hasExtraTax && extraTaxRate
        ? calculatedFinalPrice * (extraTaxRate / 100)
        : 0;

      setSellingPrice(calculatedSellingPrice.toFixed(2));
      setFinalPrice((calculatedFinalPrice + calculatedExtraTax).toFixed(2));
    }
  }, [purchasePrice, marginPercent, isIvaExempt, hasExtraTax, extraTaxRate]);

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
      purchasePrice: parseFloat(purchasePrice),
      marginPercent: parseFloat(marginPercent),
      hasExtraTax,
      extraTaxRate: parseFloat(extraTaxRate) || 0,
      sellingPrice: parseFloat(sellingPrice),
      finalPrice: parseFloat(finalPrice),
      isIvaExempt,
      categoryId,
      supplierId,
    };

    try {
      if (initialData) {
        await updateProduct(initialData.id, productData);
      } else {
        await createProduct(productData);
      }
      toast({
        title: "Producto guardado",
        description: "El producto se ha guardado con éxito.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error al guardar el producto",
        description: error.message,
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
          <FormControl mb={4}>
            <FormLabel>Nombre</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Precio de Compra</FormLabel>
            <Input
              type="number"
              value={purchasePrice}
              onChange={handlePurchasePriceChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Margen (%)</FormLabel>
            <Input
              type="number"
              value={marginPercent}
              onChange={handleMarginChange}
            />
          </FormControl>
          <SimpleGrid columns={2} spacing={5} mt={5} border="1px solid #ccc" p={3} borderRadius="md">
            <FormControl>
              <FormLabel>Precio Neto Calculado</FormLabel>
              <Input isReadOnly value={`$ ${sellingPrice}`} />
            </FormControl>
            <FormControl>
              <FormLabel>Precio Final Calculado</FormLabel>
              <Input isReadOnly value={`$ ${finalPrice}`} />
            </FormControl>
          </SimpleGrid>
          <FormControl mt={4}>
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
