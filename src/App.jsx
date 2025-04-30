import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layout components
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import SellerRoute from './components/auth/SellerRoute'

// Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import SellerDashboardPage from './pages/seller/DashboardPage'
import SellerProductsPage from './pages/seller/ProductsPage'
import SellerAddProductPage from './pages/seller/AddProductPage'
import SellerEditProductPage from './pages/seller/EditProductPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { checkAuth } = useAuth()

  // Check authentication status on app load
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected Buyer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* Protected Seller Routes */}
        <Route path="seller" element={<SellerRoute />}>
          <Route path="dashboard" element={<SellerDashboardPage />} />
          <Route path="products" element={<SellerProductsPage />} />
          <Route path="products/add" element={<SellerAddProductPage />} />
          <Route path="products/edit/:id" element={<SellerEditProductPage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App