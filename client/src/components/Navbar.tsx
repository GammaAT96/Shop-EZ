import React from 'react'
import { Heart, Menu, Search, ShoppingBag, ShoppingCart, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Link } from 'react-router-dom'

export function Navbar({ onCartClick }: { onCartClick: () => void }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user, logout } = useAuth()
  const { items } = useCart()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <ShoppingBag className="h-8 w-8 text-slate-900" />
              <span className="text-2xl font-bold text-slate-900">shopEZ</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
              >
                Home
              </a>
              <a
                href="#categories"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Categories
              </a>
              <a
                href="#deals"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('deals')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Deals
              </a>
              <a
                href="#new-arrivals"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              >
                New Arrivals
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input type="search" placeholder="Search products..." className="pl-10 bg-slate-50" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" className="text-slate-700" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:flex">
                <Button variant="outline">Login</Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <Input type="search" placeholder="Search products..." className="w-full" />
            <Link to="/" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/auth" className="block py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              {user ? 'Account' : 'Login'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

