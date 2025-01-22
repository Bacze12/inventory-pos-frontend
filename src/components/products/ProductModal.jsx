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
  const [grossCost, setGrossCost] = useState(initialData?.grossCost || '');
  const [netCost, setNetCost] = useState(initialData?.purchasePrice || '');
  const [netSalePrice, setNetSalePrice] = useState('');
  const [grossSalePrice, setGrossSalePrice] = useState('');
  const [stock, setStock] = useState(initialData?.stock || '');
  const [isActive, setIsActive] = useState(initialData?.isActive || true);
  const toast = useToast();

  // Recalcular valores cuando un campo cambia
  const recalculateValues = (field, value) => {
    let purchase = parseFloat(netCost) || 0;
    let margin = parseFloat(marginPercent) / 100 || 0;
    let gross = parseFloat(grossCost) || 0;
    let netSale = parseFloat(netSalePrice) || 0;
    let grossSale = parseFloat(grossSalePrice) || 0;

    switch (field) {
      case 'netCost':
        purchase = parseFloat(value) || 0;
        gross = purchase * (1 + margin);
        netSale = gross;
        grossSale = isIvaExempt ? netSale : netSale * 1.19;
        break;
      case 'marginPercent':
        margin = parseFloat(value) / 100 || 0;
        gross = purchase * (1 + margin);
        netSale = gross;
        grossSale = isIvaExempt ? netSale : netSale * 1.19;
        break;
      case 'grossSalePrice':
        grossSale = parseFloat(value) || 0;
        netSale = isIvaExempt ? grossSale : grossSale / 1.19;
        gross = netSale;
        purchase = gross / (1 + margin);
        break;
      case 'grossCost':
        gross = parseFloat(value) || 0;
        purchase = gross / (1 + margin);
        netSale = gross;
        grossSale = isIvaExempt ? netSale : netSale * 1.19;
        break;
      default:
        break;
    }

    setNetCost(value !== '' ? purchase.toFixed(2) : '');
    setGrossCost(value !== '' ? gross.toFixed(2) : '');
    setNetSalePrice(value !== '' ? netSale.toFixed(2) : '');
    setGrossSalePrice(value !== '' ? grossSale.toFixed(2) : '');
    setSellingPrice(value !== '' ? gross.toFixed(2) : '');
    setFinalPrice(value !== '' ? grossSale.toFixed(2) : '');
  };

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
    if (!name || !categoryId || !supplierId || !netCost || !marginPercent) {
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
      purchasePrice: parseFloat(netCost),
      marginPercent: parseFloat(marginPercent),
      hasExtraTax,
      extraTaxRate: parseFloat(extraTaxRate) || 0,
      sellingPrice: parseFloat(sellingPrice),
      finalPrice: parseFloat(finalPrice),
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
              <Input
                type="number"
                value={netCost}
                onChange={(e) => recalculateValues('netCost', e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Costo Bruto</FormLabel>
              <Input
                type="number"
                value={grossCost}
                onChange={(e) => recalculateValues('grossCost', e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Venta Neto</FormLabel>
              <Input
                type="number"
                value={netSalePrice}
                onChange={(e) => recalculateValues('netSalePrice', e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Venta Bruto</FormLabel>
              <Input
                type="number"
                value={grossSalePrice}
                onChange={(e) => recalculateValues('grossSalePrice', e.target.value)}
              />
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={2} spacing={5} mb={5}>
            <FormControl>
              <FormLabel>Margen (%)</FormLabel>
              <Input
                type="number"
                value={marginPercent}
                onChange={(e) => recalculateValues('marginPercent', e.target.value)}
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
