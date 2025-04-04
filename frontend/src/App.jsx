import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AbilityProvider } from './context/AbilityContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';

// Páginas Públicas
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Páginas de Usuario
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';

// Páginas de Admin
import Dashboard from './pages/admin/Dashboard';
import UserListPage from './pages/admin/UserListPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import CategoryListPage from './pages/admin/CategoryListPage';
import OrderListPage from './pages/admin/OrderListPage';
import ProductCreateEditPage from './pages/admin/ProductCreateEditPage';

const App = () => {
  return (
    <Router>
      <AbilityProvider>
        <Header />
        <main className="p-0 m-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            <Route 
              path="/*" 
              element={
                <Container>
                  <Routes>
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/cart/:id" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/shipping" element={<ShippingPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/placeorder" element={<PlaceOrderPage />} />
                    <Route path="/order/:id" element={<OrderPage />} />
                    
                    <Route path="/admin" element={<AdminRoute />}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="users" element={<UserListPage />} />
                      <Route path="productlist" element={<ProductListPage />} />
                      <Route path="product/create" element={<ProductCreateEditPage />} />
                      <Route path="categories" element={<CategoryListPage />} />
                      <Route path="orders" element={<OrderListPage />} />
                      <Route path="product/:id/edit" element={<ProductEditPage />} />
                    </Route>
                  </Routes>
                </Container>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </AbilityProvider>
    </Router>
  );
};

export default App;
