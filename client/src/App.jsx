

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
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

        <Route path="/dashboard/:uid" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/search/:uid" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/menu/:uid" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/favourites/:uid" element={<ProtectedRoute><Favourite /></ProtectedRoute>} />
        <Route path="/cart/:uid" element={<ProtectedRoute><Cart /></ProtectedRoute>} />

      <Route path="/checkout/:uid" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/myorders/:uid"  element={<ProtectedRoute><MyOrders/></ProtectedRoute>} />
      <Route path="/myorders/:uid/:orderId" element={<ProtectedRoute><OrderSummary/></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
      <Route path="/admin/menu" element={<ProtectedRoute><AdminMenu /></ProtectedRoute>} />
      <Route path="/admin/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
      <Route path="/admin/order-summary/:userUid/:orderId" element={<ProtectedRoute><AdminOrderSummary /></ProtectedRoute>} />
      <Route path="/admin/edit-product/:productId" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
      <Route path="/feedback/:uid/:orderId" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
      <Route path="/admin/feedback" element={<ProtectedRoute><AdminFeedBack /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
