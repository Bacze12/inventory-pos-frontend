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
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import API from '../../api/api';

const ProductModal = ({ initialData, isOpen, onClose }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || '');
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [hasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [extraTaxRate] = useState(initialData?.extraTaxRate || '');
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const [categoryId] = useState(initialData?.categoryId || '');
  const [supplierId] = useState(initialData?.supplierId || '');
  const [setCategories] = useState([]);
  const [setSuppliers] = useState([]);
  const [sellingPrice, setSellingPrice] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [isActive, setIsActive] = useState(initialData?.isActive || true);
  const toast = useToast();

  // Cálculo de precios dinámico
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

  // Escaneo de código de barras
  const startScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#scanner-container'),
          constraints: {
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['ean_reader'],
        },
      },
      (err) => {
        if (err) {
          toast({
            title: 'Error al iniciar el escáner',
            description: err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((data) => {
      setSku(data.codeResult.code);
      toast({
        title: 'Código detectado',
        description: `Código de barras: ${data.codeResult.code}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      Quagga.stop();
    });
  };

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
            <FormLabel>Código de Barra</FormLabel>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
            {(isMobile || isTablet) && (
              <Button mt={2} onClick={startScanner}>
                Escanear <FiCamera />
              </Button>
            )}
          </FormControl>
          <FormControl mb={4}>
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
          <FormControl mb={4}>
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
          <FormControl mt={4}>
            <Checkbox
              isChecked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            >
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
