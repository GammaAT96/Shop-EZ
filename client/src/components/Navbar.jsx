import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { userInfo, logout } = useAuth();
    const { cart } = useCart();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setMobileMenuOpen(false);
        }
    };

    const logoutHandler = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Categories', path: '/shop' },
        { name: 'Deals', path: '/shop' }
    ];

    return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-bold text-foreground">shopEZ</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map((link) => (
                                <Link key={link.name} to={link.path}>
                                    <Button variant="ghost">{link.name}</Button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-background"
                            />
                        </div>
                    </form>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="hidden md:flex">
                            <Heart className="w-5 h-5" />
                        </Button>

                        {userInfo ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{userInfo.username}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {userInfo.role === 'admin' && (
                                        <DropdownMenuItem asChild>
                                            <Link to="/admin/dashboard" className="w-full cursor-pointer">Admin Panel</Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile" className="w-full cursor-pointer">My Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logoutHandler} className="text-red-600 focus:text-red-500 cursor-pointer">
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link to="/login" className="hidden md:block">
                                <Button variant="default">Sign In</Button>
                            </Link>
                        )}

                        <Link to="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCartIcon className="w-5 h-5" />
                                {cart?.products?.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                                        {cart.products.length}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden mt-4 space-y-4 overflow-hidden"
                        >
                            <form onSubmit={handleSearch}>
                                <Input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </form>
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="justify-start w-full">{link.name}</Button>
                                    </Link>
                                ))}
                                {!userInfo && (
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="default" className="justify-start w-full">Sign In</Button>
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

function ShoppingCartIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    );
}
