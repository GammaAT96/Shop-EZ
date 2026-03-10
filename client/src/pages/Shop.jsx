import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, Search, ChevronDown, ShoppingCart } from 'lucide-react';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryStrings = searchParams.toString();
            // Assuming proxy or running on same port for API
            const { data } = await axios.get(`http://localhost:5000/api/products?${queryStrings}`);
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/categories`);
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
            // Need to pass category ID based on the backend rewrite, so we map name to ID
            const cat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
            if (cat) current.set('category', cat._id);
        }
        setSearchParams(current);
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* Shop Header */}
            <div className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center pt-8 justify-between">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-sm">The Shop</h1>
                        <p className="mt-4 text-slate-400 font-medium text-lg max-w-xl">Curated styles and timeless classics built to last.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Filters */}
                <div className="space-y-8 lg:col-span-1 border-r border-slate-200 pr-0 lg:pr-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                            onChange={(e) => {
                                const val = e.target.value;
                                const current = new URLSearchParams(Array.from(searchParams.entries()));
                                if (val) current.set('keyword', val);
                                else current.delete('keyword');
                                setSearchParams(current);
                            }}
                        />
                    </div>

                    <div>
                        <h3 className="font-bold tracking-wide text-slate-900 mb-4 flex items-center gap-2 uppercase text-sm">
                            <Filter className="w-4 h-4" /> Categories
                        </h3>
                        <ul className="space-y-3 font-medium text-slate-600 cursor-pointer">
                            <li onClick={() => handleCategoryClick('all')} className={`${!searchParams.get('category') ? 'text-blue-600 font-bold' : 'hover:text-slate-900'}`}>All Products</li>
                            {categories.map((c) => (
                                <li
                                    key={c._id}
                                    onClick={() => handleCategoryClick(c.name)}
                                    className={`${searchParams.get('category') === c._id ? 'text-blue-600 font-bold' : 'hover:text-slate-900'} capitalize transition-colors`}
                                >
                                    {c.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold tracking-wide text-slate-900 mb-4 flex items-center gap-2 uppercase text-sm">
                            <Filter className="w-4 h-4" /> Price Range
                        </h3>
                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="Min" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm shadow-sm font-medium focus:ring-2 outline-none" />
                            <span>-</span>
                            <input type="number" placeholder="Max" className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm shadow-sm font-medium focus:ring-2 outline-none" />
                        </div>
                        <button className="mt-4 w-full bg-slate-900 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors shadow shadow-slate-900/10">Apply Filters</button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-slate-500 font-medium">Showing {products.length} results</span>
                        <div className="relative">
                            <select className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all cursor-pointer">
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest Arrivals</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 font-medium">No products match your filters.</p>
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                        >
                            {products.map((product) => (
                                <motion.div
                                    key={product._id}
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden flex flex-col"
                                >
                                    <Link to={`/product/${product._id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
                                        <img
                                            src={product.image || "https://images.unsplash.com/photo-1531306728370-53bf9ce8cb6d?auto=format&fit=crop&q=80"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {product.stock <= 5 && product.stock > 0 && (
                                            <span className="absolute top-4 left-4 bg-red-100 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                                Only {product.stock} Left!
                                            </span>
                                        )}
                                        {product.stock === 0 && (
                                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-slate-900 text-white font-bold px-6 py-2 rounded-full uppercase tracking-widest shadow-xl">Sold Out</span>
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">{product.category?.name || 'Category'}</p>
                                            <Link to={`/product/${product._id}`} className="block text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {product.name}
                                            </Link>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                                            <button
                                                disabled={product.stock === 0}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${product.stock === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white shadow-sm'}`}
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
