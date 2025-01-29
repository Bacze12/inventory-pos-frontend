import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import  PrivateRoute  from './components/PrivateRoute';

import Home from './pages/Home';
import HomeCashier from './pages/HomeCashier';
import LoginPage from './pages/auth/Login';
import Register from './pages/auth/Register';
import CategoriesListPage from './pages/categories/CategorieList';
import CategoryUpdatePage from './pages/categories/categoryUpdatePage';
import SupplierListPage from './pages/suppliers/SupplierListPage';
import InventoryListPage from './pages/Inventory/InventoryListPage';
import InventoryDetailsPage from './pages/Inventory/InventoryDetailsPage';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/settings/SettingsPage';
import Pos from './pages/pos/Pos';


const ProductListPage = lazy(() => import('./pages/products/ProductListPage'));
const ProductDetailsPage = lazy(() => import('./pages/products/ProductDetailsPage'));
const UserManagementPage = lazy(() => import('./pages/users/UserManagementPage'));


const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes element={<Layout />}>
        <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/homecashier" element={<HomeCashier />} />
          <Route path="/categories" element={<PrivateRoute><CategoriesListPage /></PrivateRoute>} />
          <Route path="/categories/:id/edit" element={<PrivateRoute><CategoryUpdatePage /></PrivateRoute>} />
          <Route path="/suppliers" element={<PrivateRoute><SupplierListPage /></PrivateRoute>} />
          <Route path="/inventory" element={<PrivateRoute><InventoryListPage /></PrivateRoute>} />
          <Route path="/inventory/:id" element={<PrivateRoute><InventoryDetailsPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/pos" element={<PrivateRoute><Pos /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute><ProductListPage /></PrivateRoute>} />
          <Route path="/products/:id" element={<PrivateRoute><ProductDetailsPage /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><UserManagementPage /></PrivateRoute>} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
