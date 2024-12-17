import React, { useState, useEffect, useCallback } from 'react';
import Quagga from 'quagga';
import { isMobile, isTablet } from 'react-device-detect';
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
} from '@chakra-ui/react';

const ProductModal = ({ initialData, isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [scanning, setScanning] = useState(false);
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
  const toast = useToast();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleError = useCallback(
    (message, error) => {
      toast({
        title: message,
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    [toast]
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}categories`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        handleError('Error al cargar categorías:', error);
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
        handleError('Error al cargar proveedores:', error);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, [API_URL, handleError]);

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
      handleError('Error en la operación:', error);
    }
  };

  const startScanner = () => {
    setScanning(true);
    let isCodeDetected = false;

    setTimeout(() => {
      const scannerContainer = document.getElementById('scanner-container');
      if (!scannerContainer) {
        toast({
          title: 'Error',
          description: 'No se pudo encontrar el contenedor del escáner.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            target: document.querySelector('#scanner-container'), // Div donde irá el stream
            constraints: {
              facingMode: 'environment', // Usa la cámara trasera
            },
          },
          decoder: {
            readers: ['ean_reader'], // Tipos de códigos
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
        if (!isCodeDetected) {
          isCodeDetected = true; // Evita llamadas repetidas
          const scannedCode = data.codeResult.code; // Código detectado
          setSku(scannedCode); // Actualiza el estado de SKU
          toast({
            title: 'Código detectado',
            description: `Código de barras: ${scannedCode}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          stopScanner();
        }
      });
    }, 30);
  };

  const stopScanner = () => {
    setScanning(false);
    Quagga.stop();
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
      handleError('Error al crear el producto:', error);
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
            <FormLabel>Codigo de Barra</FormLabel>
            <Input value={sku} onChange={(e) => setSku(e.target.value)} />
            {/* Muestra el botón solo si es móvil o tableta */}
            {(isMobile || isTablet) && (
              <Button mt={2} colorScheme="teal" onClick={startScanner}>
                Escanear Código de Barras
              </Button>
            )}
          </FormControl>
          {scanning && (
            <div id="scanner-container" style={{ width: '100%', height: '300px' }}>
              {/* El stream de la cámara se mostrará aquí */}
            </div>
          )}
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
