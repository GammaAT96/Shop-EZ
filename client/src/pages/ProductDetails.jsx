import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { userInfo } = useAuth();
    const { fetchCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCartHandler = async () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            await axios.post('/api/cart', {
                productId: product._id,
                quantity: quantity
            }, config);

            await fetchCart();
            navigate('/cart');
        } catch (error) {
            console.error("Failed adding to cart", error);
            alert("Error adding to cart.");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return <div className="text-center py-24 min-h-screen pt-40 font-bold text-2xl text-slate-500">Product Not Found</div>;

    return (
        <div className="bg-white min-h-screen pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <Link to="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold mb-12 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Catalog
                </Link>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Image Gallery */}
                    <div className="lg:w-1/2">
                        <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden sticky top-32 shadow-sm border border-slate-100">
                            <img
                                src={product.image || "https://images.unsplash.com/photo-1531306728370-53bf9ce8cb6d?auto=format&fit=crop&q=80"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:w-1/2 flex flex-col justify-center">
                        <div className="mb-4">
                            <span className="text-sm font-black text-blue-600 tracking-widest uppercase">{product.category?.name || 'Category'}</span>
                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mt-2 leading-tight tracking-tight">{product.name}</h1>
                        </div>

                        <div className="text-3xl font-black text-slate-900 my-6">
                            ${product.price.toFixed(2)}
                        </div>

                        <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10">
                            {product.description}
                        </p>

                        {/* Add To Cart Form */}
                        <div className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <div className="flex items-center justify-between">
                                <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                                </span>
                            </div>

                            {product.stock > 0 && (
                                <div className="flex items-center gap-4">
                                    <div className="border border-slate-200 rounded-xl bg-white flex items-center p-1 w-32 shadow-sm">
                                        <button
                                            className="w-10 h-10 flex text-lg text-slate-500 items-center justify-center hover:bg-slate-100 rounded-lg transition-colors font-bold"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        >
                                            -
                                        </button>
                                        <span className="flex-1 text-center font-bold text-slate-900">{quantity}</span>
                                        <button
                                            className="w-10 h-10 flex text-lg text-slate-500 items-center justify-center hover:bg-slate-100 rounded-lg transition-colors font-bold"
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={addToCartHandler}
                                disabled={product.stock === 0}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transform disabled:translate-y-0 hover:-translate-y-0.5"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Truck className="w-6 h-6 text-slate-400" />
                                <span className="font-medium text-sm">Free Express Shipping available</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <ShieldCheck className="w-6 h-6 text-slate-400" />
                                <span className="font-medium text-sm">30-day money-back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
