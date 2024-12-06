import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const ProductListPage = lazy(() => import('./pages/products/ProductListPage'));
const AddProductPage = lazy(() => import('./pages/products/AddProductPage'));
const ProductDetailsPage = lazy(() => import('./pages/products/ProductDetailsPage'));
const UpdateProductPage = lazy(() => import('./pages/products/UpdateProductPage'));
const AddSalePage = lazy(() => import('./pages/sales/AddSalePage'));
const SalesListPage = lazy(() => import('./pages/sales/SalesListPage'));
const SaleDetailsPage = lazy(() => import('./pages/sales/SaleDetailsPage'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/:id/edit" element={<UpdateProductPage />} />
          <Route path="/add-sale" element={<AddSalePage />} />
          <Route path="/sales" element={<SalesListPage />} />
          <Route path="/sales/:id" element={<SaleDetailsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
