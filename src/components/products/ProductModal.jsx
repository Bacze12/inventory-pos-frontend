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
  Select
} from '@chakra-ui/react';

/**
 * Componente ProductModal
 * @param {boolean} isOpen - Controla si el modal está abierto.
 * @param {Function} onClose - Función para cerrar el modal.
 * @param {Function} onSubmit - Función que maneja la creación o actualización del producto.
 * @param {Object} [initialData] - Datos iniciales del producto (opcional).
 */
const ProductModal = ({ initialData, isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [sku, setSku] = useState(initialData?.sku || '');
  const [purchasePrice, setPurchasePrice] = useState(initialData?.purchasePrice || '');
  const [marginPercent, setMarginPercent] = useState(initialData?.marginPercent || '');
  const [hasExtraTax, setHasExtraTax] = useState(initialData?.hasExtraTax || false);
  const [extraTaxRate, setExtraTaxRate] = useState(initialData?.extraTaxRate || '');
  const [isIvaExempt, setIsIvaExempt] = useState(initialData?.isIvaExempt || false);
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive || true);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '');
  const [supplierId, setSupplierId] = useState(initialData?.supplierId || '');
  const [categories, setCategories] = useState([]); // Lista de categorías cargadas del backend
  const [suppliers, setSuppliers] = useState([]); // Lista de proveedores cargados del backend

  const API_URL = process.env.REACT_APP_API_URL; // Base URL desde el archivo .env

  // Cargar categorías y proveedores al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}categories`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error('Unexpected response for categories:', data);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${API_URL}suppliers`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          console.error('Unexpected response for suppliers:', data);
          setSuppliers([]);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setSuppliers([]);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, [API_URL]);

  const handleSubmit = async () => {
    const productData = {
      name,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0,
      marginPercent: marginPercent ? parseFloat(marginPercent) : 0,
      isIvaExempt,
      isActive,
      categoryId: categoryId ? parseInt(categoryId, 10) : null, // Convertir a entero
      supplierId: supplierId ? parseInt(supplierId, 10) : null, // Convertir a entero
    };

    console.log('Product Data:', productData);

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
            <Input
              placeholder="Ingresa el nombre del producto"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>SKU</FormLabel>
            <Input
              placeholder="Ingresa el SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Precio de Compra</FormLabel>
            <Input
              type="number"
              placeholder="Ingresa el precio de compra"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Porcentaje de Margen</FormLabel>
            <Input
              type="number"
              placeholder="Ingresa el porcentaje de margen"
              value={marginPercent}
              onChange={(e) => setMarginPercent(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <Checkbox
              isChecked={hasExtraTax}
              onChange={(e) => setHasExtraTax(e.target.checked)}
            >
              Tiene Impuesto Extra
            </Checkbox>
          </FormControl>
          {hasExtraTax && (
            <FormControl mb={4}>
              <FormLabel>Tasa de Impuesto Extra</FormLabel>
              <Input
                type="number"
                placeholder="Ingresa la tasa de impuesto extra"
                value={extraTaxRate}
                onChange={(e) => setExtraTaxRate(e.target.value)}
              />
            </FormControl>
          )}
          <FormControl mb={4}>
            <Checkbox
              isChecked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            >
              Activo
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
          <FormControl mb={4}>
            <FormLabel>Stock</FormLabel>
            <Input
              type="number"
              placeholder="Ingresa el stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Categoría</FormLabel>
            <Select
              placeholder="Selecciona una categoría"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {(categories || []).map((category) => (
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
              {(suppliers || []).map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </FormControl>
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
