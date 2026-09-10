import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import ProductDetails from '../pages/ProductDetails';
import EditProduct from '../pages/EditProduct';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/products" element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      } />
      <Route path="/add-product" element={
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      } />
      <Route path="/product/:id" element={
        <ProtectedRoute>
          <ProductDetails />
        </ProtectedRoute>
      } />
      <Route path="/edit-product/:id" element={
        <ProtectedRoute>
          <EditProduct />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default AppRoutes;
