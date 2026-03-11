import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { CartSidebar } from '@/components/CartSidebar'
import { HomePage } from '@/pages/HomePage'
import { AuthPage } from '@/pages/AuthPage'
import { useAuth } from '@/context/AuthContext'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { AdminPage } from '@/pages/AdminPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="p-6">Loading…</div>
  if (!user) return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">Loading…</div>
  if (!user) return <Navigate to="/auth" replace />
  if (user.usertype !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const [cartOpen, setCartOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-white">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/checkout"
          element={
            <RequireAuth>
              <CheckoutPage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
      </Routes>
    </div>
  )
}

