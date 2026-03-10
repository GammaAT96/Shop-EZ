import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, ChevronDown, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { fetchCart, cart } = useCart();
    const { userInfo } = useAuth();

    const searchKeyword = searchParams.get('search') || '';
    const [searchInput, setSearchInput] = useState(searchKeyword);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryStrings = searchParams.toString();
            const { data } = await axios.get(`/api/products?${queryStrings}`);
            setProducts(data.products || data);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`/api/categories`);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCategoryClick = (catName) => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (catName === 'all') {
            current.delete('category');
        } else {
            const cat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
            if (cat) current.set('category', cat._id);
            else current.set('category', catName); // Fallback for string matching
        }
        setSearchParams(current);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        if (searchInput) current.set('search', searchInput);
        else current.delete('search');
        setSearchParams(current);
    };

    const handleAddToCart = async (product) => {
        if (!userInfo) {
            window.location.href = '/login';
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.post('/api/cart', {
                productId: product._id,
                quantity: 1
            }, config);
            await fetchCart();
        } catch (error) {
            console.error("Failed adding to cart", error);
        }
    };

    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Shop Header */}
            <div className="bg-card text-card-foreground py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
                <div className="container mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Shop</h1>
                    <p className="mt-4 text-muted-foreground text-lg max-w-xl">Curated styles and timeless classics built to last.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Sidebar Filters */}
                <div className="space-y-8 lg:col-span-1 border-border lg:pr-8">
                    <form className="relative" onSubmit={handleSearchSubmit}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchInput}
                            className="pl-9"
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </form>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Categories
                        </h3>
                        <div className="flex flex-col gap-2">
                            <Button
                                variant={!searchParams.get('category') ? "default" : "ghost"}
                                className="justify-start"
                                onClick={() => handleCategoryClick('all')}
                            >
                                All Products
                            </Button>
                            {categories.map((c) => (
                                <Button
                                    key={c._id}
                                    variant={searchParams.get('category') === (c._id || c.name) ? "default" : "ghost"}
                                    className="justify-start capitalize"
                                    onClick={() => handleCategoryClick(c.name)}
                                >
                                    {c.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-muted-foreground text-sm">Showing {products.length} results</span>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    Sort by <ChevronDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Featured</DropdownMenuItem>
                                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                                <DropdownMenuItem>Newest Arrivals</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center p-24">
                            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <Card className="flex flex-col py-24 items-center justify-center text-center">
                            <Package className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
                            <h3 className="text-xl font-semibold">No products found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
                        </Card>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
