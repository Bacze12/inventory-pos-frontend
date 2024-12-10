import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from './components/layout/Layout';
import LoginPage from './pages/auth/Login';
import Register from './pages/auth/Register';

const ProductListPage = lazy(() => import('./pages/products/ProductListPage'));
const AddProductPage = lazy(() => import('./pages/products/AddProductPage'));
const ProductDetailsPage = lazy(() => import('./pages/products/ProductDetailsPage'));
const UpdateProductPage = lazy(() => import('./pages/products/UpdateProductPage'));
const AddSalePage = lazy(() => import('./pages/sales/AddSalePage'));
const SalesListPage = lazy(() => import('./pages/sales/SalesListPage'));
const SaleDetailsPage = lazy(() => import('./pages/sales/SaleDetailsPage'));
const UserManagementPage = lazy(() => import('./pages/users/UserManagementPage'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes element={<Layout />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/:id/edit" element={<UpdateProductPage />} />
          <Route path="/add-sale" element={<AddSalePage />} />
          <Route path="/sales" element={<SalesListPage />} />
          <Route path="/sales/:id" element={<SaleDetailsPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserManagementPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
