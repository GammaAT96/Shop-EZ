import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

    if (cart === null && userInfo) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
    );

    const subtotal = cart?.products?.reduce((acc, item) => acc + (item.productId?.price * item.quantity), 0) || 0;
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + shipping;

    return (
        <div className="bg-background min-h-screen py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart ({cart?.products?.length || 0})</h1>

                {(!cart || cart.products.length === 0) ? (
                    <Card className="flex flex-col py-24 items-center justify-center text-center">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-6">Your cart is currently empty.</p>
                        <Link to="/shop">
                            <Button size="lg">Continue Shopping</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-1 space-y-4">
                            {cart.products.map((item) => (
                                <Card key={item.productId._id}>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="flex gap-4">
                                            <img
                                                src={item.productId.thumbnailUrl || item.productId.imageUrls?.[0] || item.productId.image || "https://images.unsplash.com/photo-1531306728370-53bf9ce8cb6d"}
                                                alt={item.productId.name}
                                                className="w-24 h-24 object-cover rounded-md border border-border"
                                            />
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <Link to={`/product/${item.productId._id}`}>
                                                            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">{item.productId.name}</h3>
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground mt-1">${item.productId.price.toFixed(2)}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-destructive shrink-0"
                                                        onClick={() => removeFromCart(item.productId._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center gap-4 mt-4">
                                                    <div className="flex items-center border border-border rounded-md w-fit">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-none border-r border-border hover:bg-muted"
                                                            onClick={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-none border-l border-border hover:bg-muted"
                                                            onClick={() => updateQuantity(item.productId._id, Math.min(item.productId.stock, item.quantity + 1))}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-96">
                            <Card className="sticky top-24">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-between font-bold text-lg mb-6">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <Button size="lg" className="w-full text-md" onClick={() => navigate('/checkout')}>
                                        Proceed to Checkout
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
