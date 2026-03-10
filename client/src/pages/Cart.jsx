import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
    const { cart, fetchCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const removeFromCart = async (productId) => {
        if (!userInfo) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        try {
            await axios.delete(`/api/cart/${productId}`, config);
            fetchCart();
        } catch (error) {
            console.error("Remove failed", error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (!userInfo) return;
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        try {
            await axios.put(`/api/cart`, { productId, quantity }, config);
            fetchCart();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    if (cart === null && userInfo) return <div className="text-center py-20 min-h-screen text-slate-500 font-bold">Loading Cart...</div>;

    const subtotal = cart?.products?.reduce((acc, item) => acc + (item.productId?.price * item.quantity), 0) || 0;

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-12">Shopping Cart</h1>

                {(!cart || cart.products.length === 0) ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                        <p className="text-slate-500 font-medium text-lg mb-6">Your cart is currently empty.</p>
                        <Link to="/shop" className="inline-flex px-8 py-3 bg-slate-900 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Cart Items */}
                        <div className="lg:w-2/3 space-y-6">
                            {cart.products.map((item) => (
                                <div key={item.productId._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
                                    <Link to={`/product/${item.productId._id}`} className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                        <img src={item.productId.image || "https://images.unsplash.com/photo-1531306728370-53bf9ce8cb6d?auto=format&fit=crop&q=80"} className="w-full h-full object-cover" alt="product" />
                                    </Link>

                                    <div className="flex-1 text-center sm:text-left">
                                        <Link to={`/product/${item.productId._id}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
                                            {item.productId.name}
                                        </Link>
                                        <p className="font-black text-slate-700 mt-2">${item.productId.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
                                        <div className="border border-slate-200 rounded-xl bg-slate-50 flex items-center p-1 w-28">
                                            <button
                                                className="w-8 h-8 flex text-slate-600 items-center justify-center hover:bg-white rounded-lg font-bold shadow-sm"
                                                onClick={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                                            >-</button>
                                            <span className="flex-1 text-center font-bold text-slate-900">{item.quantity}</span>
                                            <button
                                                className="w-8 h-8 flex text-slate-600 items-center justify-center hover:bg-white rounded-lg font-bold shadow-sm"
                                                onClick={() => updateQuantity(item.productId._id, Math.min(item.productId.stock, item.quantity + 1))}
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.productId._id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                                        >
                                            <Trash2 className="w-4 h-4" /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-32">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 pb-6 border-b border-slate-100">Order Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Shipping</span>
                                        <span className="text-slate-900">{subtotal > 99 ? 'Free' : '$10.00'}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 font-medium">
                                        <span>Tax</span>
                                        <span className="text-slate-900">${(subtotal * 0.05).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6 mb-8 flex justify-between items-center">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <span className="text-3xl font-black text-slate-900">
                                        ${(subtotal + (subtotal > 99 ? 0 : 10) + (subtotal * 0.05)).toFixed(2)}
                                    </span>
                                </div>

                                {/* Checkout Routing */}
                                <button onClick={() => navigate('/checkout')} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:bg-blue-600 hover:shadow-blue-600/30 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-0.5">
                                    Checkout Now <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
