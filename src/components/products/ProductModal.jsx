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
  const [scanning, setScanning] = useState(false);
  const [purchasePrice] = useState(initialData?.purchasePrice || '');
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [hasExtraTax, setHasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [extraTaxRate, setExtraTaxRate] = useState(initialData?.extraTaxRate || '');
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [categories, setCategories] = useState([]);
  const [formData] = useState(initialData || {});
  const [suppliers, setSuppliers] = useState([]);
  const [netCost, setNetCost] = useState([]);
  const [grossCost, setGrossCost] = useState([]);
  const [grossSalePrice] = useState([]);
  const toast = useToast();
  const [sellingPrice, setSellingPrice] = useState(initialData?.sellingPrice || '');
  const [isActive, setIsActive] = useState(initialData?.isActive || true);
  const [finalPrice, setFinalPrice] = useState(initialData?.finalPrice || '');
  const [netSalePrice, setNetSalePrice] = useState([]);

  const handleNetCostChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setNetCost(value);
    }
    setGrossCost(Math.round(value * 1.19));
  };
    
  const handleGrossCostChange = (e) => {
    const value = parseFloat(e.target.value);
    setGrossCost(Math.round(value));
    setNetCost(Math.round(value / 1.19));
  };

  const handleNetSalePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setNetSalePrice(Math.round(value));
    setFinalPrice(Math.round(value * 1.19));
  };
    
  const handleGrossSalePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setFinalPrice(Math.round(value));
    setNetSalePrice(Math.round(value / 1.19));
  };

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
        const response = await API.get('/categories');
        setCategories(response.data);
      } catch (error) {
        handleError('Error al cargar categorías:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await API.get('/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        handleError('Error al cargar proveedores:', error);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, [handleError]);

  useEffect(() => {
    setSellingPrice(Math.round(purchasePrice / 1.19));
  }, [purchasePrice]);

  useEffect(() => {
    if (grossCost > 0) {
      setMarginPercent(Math.round(((finalPrice * 100) / grossCost))-100);
    }
  }, [finalPrice, grossCost]);

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
            target: document.querySelector('#scanner-container'),
            constraints: {
              facingMode: 'environment',
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

    // Validación de campos requeridos
    console.log('Valores originales:', {
      categoryId,
      supplierId,
      purchasePrice,
      sellingPrice,
      name
    });

    // Validar campos obligatorios
    if (!name || !categoryId || !supplierId) {
      toast({
        title: "Error de validación",
        description: "Todos los campos son obligatorios",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const productData = {
      name,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      finalPrice: parseFloat(finalPrice) || 0,
      marginPercent: parseFloat(marginPercent) || 0,
      isIvaExempt,
      isActive,
      categoryId: Number(categoryId),
      supplierId: Number(supplierId)
    };

    console.log('Datos del producto a enviar:', productData);

    try {
      if (initialData) {
        console.log('Actualizando producto:', initialData.id);
        await updateProduct(initialData.id, formData);
      } else {
        console.log('Creando nuevo producto');
        await createProduct(productData);
      }
      toast({
      title: "Producto guardado.",
      description: "El producto ha sido guardado exitosamente.",
      status: "success",
      duration: 5000,
      isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
      title: "Error al guardar el producto.",
      description: "Ocurrió un error al guardar el producto. Por favor, inténtalo de nuevo.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });

    console.log('Validando finalPrice:', finalPrice);
    if (finalPrice % 10 !== 0) {
      toast({
        title: 'Error',
        description: 'El valor de venta bruto debe ser múltiplo de 10.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    // Aquí puedes agregar el resto de la lógica para enviar el formulario
    onSubmit({
      name,
      sku,
      purchasePrice,
      marginPercent,
      hasExtraTax,
      extraTaxRate,
      sellingPrice,
      isIvaExempt,
      isActive,
      categoryId,
      supplierId,
      netCost,
      finalPrice,
      grossCost,
      netSalePrice,
      grossSalePrice,
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
            <SimpleGrid columns={[1, 2]} spacing={10} mb={3}>
              <FormControl mb={4}>
              <FormLabel>Nombre</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl mb={4}>
              <FormLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FiCamera style={{ marginRight: '8px' }} />
                  Codigo de Barra
                </div>
              </FormLabel>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} />
              {/* Muestra el botón solo si es móvil o tableta */}
              {(isMobile || isTablet) && (
                <Button mt={2} colorScheme="teal" onClick={startScanner}></Button>
              )}
            </FormControl>
              {scanning && (
                <div id="scanner-container" style={{ width: '100%', height: '300px' }}>
                  {/* El stream de la cámara se mostrará aquí */}
                </div>
              )}
            </SimpleGrid>
  
            <SimpleGrid columns={[1, 2]} spacing={10} mb={3}>
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
            </SimpleGrid>
  
            <SimpleGrid columns={[1, 2, 3]} spacing={10} mb={3}>
              <FormControl mb={4}>
                <FormLabel textAlign="center">Costo Neto</FormLabel>
                <Input
                  type="number"
                  value={netCost}
                  onChange={handleNetCostChange}
                  placeholder="$ 0"
                />
              </FormControl>
              <FormControl> </FormControl>
              <FormControl mb={4}>
                <FormLabel textAlign="center">Costo Bruto</FormLabel>
                <Input
                  type="number"
                  value={grossCost}
                  onChange={handleGrossCostChange}
                  placeholder="$ 0"
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={[1, 2, 3]} spacing={10} mb={3}>
              <FormControl mb={4}>
                <FormLabel textAlign="center">Venta Neto</FormLabel>
                <Input
                  type="number"
                  value={netSalePrice}
                  onChange={handleNetSalePriceChange}
                  placeholder="$ 0"
                />
              </FormControl>
              <FormControl>
                <FormLabel textAlign="center">Margen A.I</FormLabel>
                <Input
                  type="number"
                  textAlign="center"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(e.target.value)}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel textAlign="center">Venta Bruto</FormLabel>
                <Input
                  type="number"
                  value={finalPrice}
                  placeholder="$ 0"
                  onChange={handleGrossSalePriceChange}
                />
              </FormControl>
            </SimpleGrid>

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
          <Button onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
