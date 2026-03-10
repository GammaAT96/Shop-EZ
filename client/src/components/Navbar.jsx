import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { userInfo, logout } = useAuth();
    const { cart } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <span className={`font-black text-2xl tracking-tighter ${scrolled ? 'text-slate-900' : 'text-slate-900 drop-shadow-sm'}`}>ShopEZ.</span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        {['Home', 'Shop', 'Categories', 'About'].map((item, index) => (
                            <Link
                                key={index}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                className={`text-sm font-semibold tracking-wide transition-colors hover:text-blue-600 ${scrolled ? 'text-slate-600' : 'text-slate-800'}`}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-slate-500 hover:text-blue-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link to="/cart" className="relative text-slate-500 hover:text-blue-600 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {cart?.products?.length || 0}
                            </span>
                        </Link>

                        {userInfo ? (
                            <div className="relative group cursor-pointer inline-flex items-center space-x-2">
                                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="p-4 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{userInfo.username}</p>
                                        <p className="text-xs text-slate-500 truncate">{userInfo.email}</p>
                                    </div>
                                    <div className="p-2">
                                        {userInfo.role === 'admin' && (
                                            <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors">
                                                Dashboard
                                            </Link>
                                        )}
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors">
                                            My Profile
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-slate-100">
                                        <button onClick={logoutHandler} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-md hover:shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 transform hover:-translate-y-0.5">
                                Sign In
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center space-x-4">
                        <Link to="/cart" className="relative text-slate-500">
                            <ShoppingBag className="w-6 h-6" />
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-800 p-2">
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 overflow-hidden shadow-2xl"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {['Home', 'Shop', 'Categories', 'About'].map((item, index) => (
                                <Link
                                    key={index}
                                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-xl"
                                >
                                    {item}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-slate-100">
                                {userInfo ? (
                                    <>
                                        <div className="px-4 py-2 mb-2">
                                            <p className="text-sm font-semibold text-slate-800">{userInfo.username}</p>
                                        </div>
                                        {userInfo.role === 'admin' && (
                                            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-800 hover:bg-slate-50 rounded-xl">Dashboard</Link>
                                        )}
                                        <button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl">
                                            Sign out
                                        </button>
                                    </>
                                ) : (
                                    <div className="px-4 space-y-3">
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-5 py-3 text-base font-semibold text-white bg-slate-900 rounded-xl">
                                            Sign In
                                        </Link>
                                        <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-5 py-3 text-base font-semibold text-slate-900 bg-slate-100 rounded-xl">
                                            Create Account
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
