import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Checkout() {
    const { cart, fetchCart } = useCart();
    const { userInfo } = useAuth();
    const navigate = useNavigate();

    const [shippingDetails, setShippingDetails] = useState({
        name: userInfo?.username || '',
        mobile: '',
        email: userInfo?.email || '',
        address: '',
        pincode: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!cart || !cart.products || cart.products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-background">
                <h2 className="text-2xl font-bold text-foreground mt-4">Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Continue Shopping</button>
            </div>
        );
    }

    const handleChange = (e) => {
        setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // Transform cart format into order items array
            const orderItems = cart.products.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price,
                size: item.size || 'M'
            }));

            const orderData = {
                orderItems,
                totalAmount: cart.products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0),
                shippingDetails,
                paymentMethod: 'Credit Card'
            };

            await axios.post('/api/orders', orderData, config);

            // Tell backend API to explicitly clear the cart as well. Or we can just re-fetch an empty one depending on logic
            // Assuming order creation clears cart on the backend! If not, we trigger API empty cart here
            await axios.delete('/api/cart/empty', config).catch(() => console.log('Ignore if not implemented'));

            await fetchCart();
            setSuccess(true);
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        } catch (error) {
            console.error(error);
            alert('Checkout Failed: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
                <CheckCircle className="w-20 h-20 text-green-500 mb-6 drop-shadow-md" />
                <h1 className="text-4xl font-extrabold text-foreground text-center mb-4">Order Placed Successfully!</h1>
                <p className="text-lg text-muted-foreground text-center mb-8 max-w-md">Thank you for shopping at ShopEZ. We are directing you to your profile page to track the status.</p>
                <button onClick={() => navigate('/profile')} className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 shadow-lg transition-all">Go to Profile</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/cart')} className="flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Cart
                </button>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Secure Checkout</h1>
                    <p className="mt-2 text-muted-foreground">Provide your shipping details below.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7">
                        <div className="bg-card rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-border relative overflow-hidden">
                            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Shipping Information</h2>
                            <form onSubmit={handleCheckout} className="space-y-5 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <input className="w-full p-4 border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary transition-shadow bg-background" name="name" value={shippingDetails.name} onChange={handleChange} placeholder="Full Name" required />
                                    <input className="w-full p-4 border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary transition-shadow bg-background" name="email" type="email" value={shippingDetails.email} onChange={handleChange} placeholder="Email Address" required />
                                </div>
                                <input className="w-full p-4 border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary transition-shadow bg-background" name="mobile" value={shippingDetails.mobile} onChange={handleChange} placeholder="Phone Number" required />
                                <textarea className="w-full p-4 border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary transition-shadow bg-background h-32 resize-none" name="address" value={shippingDetails.address} onChange={handleChange} placeholder="Street Address, Apartment, etc." required></textarea>
                                <input className="w-full p-4 border border-input rounded-xl outline-none focus:ring-2 focus:ring-primary transition-shadow bg-background" name="pincode" value={shippingDetails.pincode} onChange={handleChange} placeholder="Postal Code / PIN" required />

                                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground p-4 rounded-xl font-bold text-lg hover:bg-primary/90 shadow-md transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-4">
                                    {loading ? 'Processing Payment...' : 'Confirm & Pay'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-card rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-border flex flex-col h-full sticky top-28">
                            <h2 className="text-2xl font-bold mb-6 text-card-foreground">Order Summary</h2>
                            <div className="flex-grow overflow-auto mb-6 pr-2 space-y-4">
                                {cart.products.map((item) => (
                                    <div key={item.productId._id} className="flex gap-4 p-4 rounded-2xl border border-border bg-background">
                                        <div className="w-16 h-16 rounded-xl shadow-sm border border-border overflow-hidden flex-shrink-0">
                                            <img src={item.productId.image || 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9'} alt={item.productId.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-bold text-foreground text-sm line-clamp-1">{item.productId.name}</p>
                                            <p className="text-xs font-medium text-muted-foreground mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-extrabold text-primary">${(item.productId.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-border space-y-3">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-foreground">${cart.products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-500">Free</span>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-border text-xl font-black text-foreground">
                                    <span>Total</span>
                                    <span className="text-2xl text-primary">${cart.products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
