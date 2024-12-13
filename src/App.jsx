import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Layout } from './components/layout/Layout';
import LoginPage from './pages/auth/Login';
import Register from './pages/auth/Register';

import CategoriesListPage from './pages/categories/CategorieList';
import CategoryUpdatePage from './pages/categories/categoryUpdatePage';
import SupplierListPage from './pages/suppliers/SupplierListPage'; // Import SupplierListPage
import SupplierUpdatePage from './pages/suppliers/SupplierUpdatePage'; // Import SupplierUpdatePage
import InventoryListPage from './pages/Inventory/InventoryListPage';
import InventoryDetailsPage from './pages/Inventory/InventoryDetailsPage';
import Dashboard from './pages/Dashboard';

import Pos from './pages/pos/Pos';


const ProductListPage = lazy(() => import('./pages/products/ProductListPage'));
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
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/:id/edit" element={<UpdateProductPage />} />
          <Route path="/add-sale" element={<AddSalePage />} />
          <Route path="/sales" element={<SalesListPage />} />
          <Route path="/sales/:id" element={<SaleDetailsPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<UserManagementPage />} />

          <Route path="/categories" element={<CategoriesListPage />} />
          <Route path="/categories/:id/edit" element={<CategoryUpdatePage />} />
          <Route path="/suppliers" element={<SupplierListPage />} /> {/* Add SupplierListPage route */}
          <Route path="/suppliers/:id" element={<SupplierUpdatePage />} /> {/* Add SupplierUpdatePage route */}
          <Route path="/inventory" element={<InventoryListPage />} />
          <Route path="/inventory/:id" element={<InventoryDetailsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/pos" element={<Pos />} />

        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
