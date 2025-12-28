import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
import Courses from '../pages/Courses'
import Kids from '../pages/Kids'
import MentoringPage from '../pages/Mentoring/MentoringPage'
import StorePage from '../pages/Store/StorePage'
import About from '../pages/About'
import Contact from '../pages/Contact'
import CheckoutPage from '../pages/Checkout/CheckoutPage'
import LoginPage from '../pages/Auth/LoginPage'
import ProfilePage from '../pages/Auth/ProfilePage'
import OrdersPage from '../pages/Orders/OrdersPage'
import PrivateRoute from '../components/auth/PrivateRoute'

import AdminSeeder from '../pages/Admin/AdminSeeder'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminOrders from '../pages/Admin/AdminOrders'
import AdminLayout from '../layouts/AdminLayout'
import AdminRoute from '../pages/Admin/AdminRoute'
import PromotePage from '../pages/Admin/PromotePage'
import ProductList from '../pages/Admin/ProductList'
import ProductForm from '../pages/Admin/ProductForm'

function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-3xl font-bold">404</h1>
        <p className="text-slate-600 mt-2">Página não encontrada.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<AuthProvider><AppLayout /></AuthProvider>}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/mentorias" element={<MentoringPage />} />
            <Route path="/loja" element={<StorePage />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/promote" element={<PromotePage />} />

            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/:id" element={<ProductForm />} />
              <Route path="seed" element={<AdminSeeder />} />
            </Route>

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
