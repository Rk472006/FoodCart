

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';      
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './components/Dashboard'; 
import Search from './user/Search';
import Favourite from './user/Favourite';
import Menu from './user/Menu';
import Cart from './user/Cart';
import Checkout from './user/Checkout';
import MyOrders from './user/MyOrders';
import OrderSummary from './user/OrderSummary';
import AdminOrdersPage from './admin/AdminOrderspage';
import AdminMenu from './admin/AdminMenu';
import AddProduct from './admin/AddProduct';
import EditProduct from './admin/EditProduct';
import AdminOrderSummary from './admin/AdminOrderSummary';
import ProtectedRoute from './auth/Protected'; 
import FeedbackPage from './user/FeedBackPage'; 
import AdminFeedBack from './admin/AdminFeedBack';
import ProtectedAdminRoute from './auth/ProtectedAdmin';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute><Favourite /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/myorders"  element={<ProtectedRoute><MyOrders/></ProtectedRoute>} />
      <Route path="/myorders/:orderId" element={<ProtectedRoute><OrderSummary/></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrdersPage /></ProtectedAdminRoute>} />
      <Route path="/admin/menu" element={<ProtectedAdminRoute><AdminMenu /></ProtectedAdminRoute>} />
      <Route path="/admin/add-product" element={<ProtectedAdminRoute><AddProduct /></ProtectedAdminRoute>} />
      <Route path="/admin/order-summary/:userUid/:orderId" element={<ProtectedAdminRoute><AdminOrderSummary /></ProtectedAdminRoute>} />
      <Route path="/admin/edit-product/:productId" element={<ProtectedAdminRoute><EditProduct /></ProtectedAdminRoute>} />
      <Route path="/feedback/:orderId" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
      <Route path="/admin/feedback" element={<ProtectedAdminRoute><AdminFeedBack /></ProtectedAdminRoute>} />
    </Routes>
  );
}

export default App;
