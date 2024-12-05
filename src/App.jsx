import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import ProductDetails from './components/ProductDetails';
import UpdateProduct from './components/UpdateProduct';
import AddSale from './components/AddSale';
import SalesList from './components/SalesList';
import SaleDetails from './components/SaleDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/products/:id/edit" element={<UpdateProduct />} />
        <Route path="/add-sale" element={<AddSale />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/sales/:id" element={<SaleDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
