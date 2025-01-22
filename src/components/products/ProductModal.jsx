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
  const [stock, setStock] = useState(initialData?.stock || '');
  const [isActive, setIsActive] = useState(initialData?.isActive || true);
  const [grossCost, setGrossCost] = useState('');
  const [netCost, setNetCost] = useState('');
  const toast = useToast();

  // Cálculo de precios dinámico
  useEffect(() => {
    if (purchasePrice && marginPercent) {
      const marginMultiplier = 1 + marginPercent / 100;
      const calculatedSellingPrice = purchasePrice * marginMultiplier;

      const calculatedGrossCost = purchasePrice * marginMultiplier;
      const calculatedNetCost = isIvaExempt
        ? calculatedGrossCost
        : calculatedGrossCost * 1.19;

      const calculatedExtraTax = hasExtraTax && extraTaxRate
        ? calculatedNetCost * (extraTaxRate / 100)
        : 0;

      setSellingPrice(calculatedGrossCost.toFixed(2));
      setFinalPrice((calculatedNetCost + calculatedExtraTax).toFixed(2));
      setGrossCost(calculatedGrossCost.toFixed(2)); // Costo Bruto
      setNetCost((calculatedNetCost + calculatedExtraTax).toFixed(2)); // Costo Neto
    }
  }, [purchasePrice, marginPercent, isIvaExempt, hasExtraTax, extraTaxRate]);

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
      extraTaxRate: hasExtraTax ? parseFloat(extraTaxRate) : 0,
      sellingPrice: parseFloat(sellingPrice),
      finalPrice: parseFloat(finalPrice),
      isIvaExempt,
      isActive,
      stock: parseInt(stock, 10),
      categoryId,
      supplier: supplierId,
    };

    try {
      const response = initialData
        ? await updateProduct(initialData.id, productData)
        : await createProduct(productData);

      if (response) {
        toast({
          title: "Producto guardado",
          description: "El producto se ha guardado con éxito.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error al guardar el producto",
        description: error.response?.data?.message || "Ocurrió un error inesperado.",
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
            <FormLabel>Código de Barra</FormLabel>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Stock</FormLabel>
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
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
            <FormLabel>Margen (%)</FormLabel>
            <Input
              type="number"
              value={marginPercent}
              onChange={(e) => setMarginPercent(e.target.value)}
            />
          </FormControl>
          <SimpleGrid columns={2} spacing={5} mt={5} border="1px solid #ccc" p={3} borderRadius="md">
            <FormControl>
              <FormLabel>Costo Bruto</FormLabel>
              <Input isReadOnly value={`$ ${grossCost}`} />
            </FormControl>
            <FormControl>
              <FormLabel>Costo Neto</FormLabel>
              <Input isReadOnly value={`$ ${netCost}`} />
            </FormControl>
          </SimpleGrid>
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
