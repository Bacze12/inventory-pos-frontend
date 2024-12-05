import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const ProductList = lazy(() => import('./components/ProductList'));
const AddProduct = lazy(() => import('./components/AddProduct'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const UpdateProduct = lazy(() => import('./components/UpdateProduct'));
const AddSale = lazy(() => import('./components/AddSale'));
const SalesList = lazy(() => import('./components/SalesList'));
const SaleDetails = lazy(() => import('./components/SaleDetails'));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/:id/edit" element={<UpdateProduct />} />
          <Route path="/add-sale" element={<AddSale />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/sales/:id" element={<SaleDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
