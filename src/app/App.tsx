import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { CartProvider } from '../context/CartContext'
import AppLayout from '../layouts/AppLayout'
import Home from '../pages/Home'
import Kids from '../pages/Kids'
import StorePage from '../pages/Store/StorePage'
import About from '../pages/About'
import Contact from '../pages/Contact'
import CheckoutPage from '../pages/Checkout/CheckoutPage'
import PaymentReturnPage from '../pages/Checkout/PaymentReturnPage'
import LoginPage from '../pages/Auth/LoginPage'
import ProfilePage from '../pages/Auth/ProfilePage'
import OrdersPage from '../pages/Orders/OrdersPage'
import PrivateRoute from '../components/auth/PrivateRoute'

import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminOrders from '../pages/Admin/AdminOrders'
import AdminLayout from '../layouts/AdminLayout'
import AdminRoute from '../pages/Admin/AdminRoute'
import ProductList from '../pages/Admin/ProductList'
import ProductForm from '../pages/Admin/ProductForm'
import LibraryPage from '../pages/Library/LibraryPage'
import MentoringPage from '../pages/Mentoring/MentoringPage'
import MentoringCatalog from '../pages/Mentoring/MentoringCatalog'
import MentorProfile from '../pages/Mentoring/MentorProfile'
import MentoringSchedule from '../pages/Mentoring/MentoringSchedule'
import MentoringCheckout from '../pages/Mentoring/MentoringCheckout'
import MentoringDashboard from '../pages/Mentoring/MentoringDashboard'
import MentoringReview from '../pages/Mentoring/MentoringReview'
import MentoringNotifications from '../pages/Mentoring/MentoringNotifications'
import MentoringGroupSession from '../pages/Mentoring/MentoringGroupSession'
import MentoringAI from '../pages/Mentoring/MentoringAI'
import MentoringSummaries from '../pages/Mentoring/MentoringSummaries'

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
            <Route path="/loja" element={<StorePage />} />
            <Route path="/kids" element={<Kids />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/mentoria" element={<MentoringPage />} />
            <Route path="/mentoria/catalogo" element={<MentoringCatalog />} />
            <Route path="/mentoria/mentor/:id" element={<MentorProfile />} />
            <Route
              path="/mentoria/agendar/:id"
              element={
                <PrivateRoute>
                  <MentoringSchedule />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentoria/checkout/:id"
              element={
                <PrivateRoute>
                  <MentoringCheckout />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentoria/dashboard"
              element={
                <PrivateRoute>
                  <MentoringDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentoria/avaliar/:sessionId"
              element={
                <PrivateRoute>
                  <MentoringReview />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentoria/notificacoes"
              element={
                <PrivateRoute>
                  <MentoringNotifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentoria/grupo/:id"
              element={
                <PrivateRoute>
                  <MentoringGroupSession />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentoria/matching"
              element={
                <PrivateRoute>
                  <MentoringAI />
                </PrivateRoute>
              }
            />
            <Route
              path="/mentoria/resumos"
              element={
                <PrivateRoute>
                  <MentoringSummaries />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkout/status" element={<PaymentReturnPage />} />

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

            <Route
              path="/library"
              element={
                <PrivateRoute>
                  <LibraryPage />
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
