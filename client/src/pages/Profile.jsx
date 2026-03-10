import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, ShieldCheck, User } from 'lucide-react';

export default function Profile() {
    const { userInfo, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('/api/orders/my', config);
                // Sort by newest first
                setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            } catch (error) {
                console.error("Order fetch error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [userInfo, navigate]);

    if (!userInfo) return null;

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-card rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-border flex items-center gap-6 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
                    <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 relative z-10">
                        <User className="w-12 h-12" />
                    </div>
                    <div className="relative z-10 flex-grow">
                        <h1 className="text-3xl font-extrabold text-card-foreground">{userInfo.username}</h1>
                        <p className="text-muted-foreground font-medium mt-1">{userInfo.email}</p>
                        <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full border border-green-500/20">
                            <ShieldCheck className="w-4 h-4 mr-1" /> {userInfo.role.toUpperCase()} ACCOUNT
                        </div>
                    </div>
                    <div className="relative z-10">
                        <button onClick={() => { logout(); navigate('/login'); }} className="px-6 py-2.5 bg-destructive/10 text-destructive font-bold rounded-full hover:bg-destructive/20 transition-colors border border-destructive/20">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-card rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-border text-card-foreground">
                    <h2 className="text-2xl font-bold mb-6 flex items-center"><Package className="mr-3 text-primary" /> Order History</h2>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-2xl w-full"></div>)}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16 bg-background rounded-2xl border border-border border-dashed">
                            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-foreground">No orders yet</h3>
                            <p className="text-muted-foreground mt-2">When you place an order, it will appear here.</p>
                            <button onClick={() => navigate('/shop')} className="mt-6 px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition">Start Shopping</button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map((order) => (
                                <div key={order._id} className="border border-border rounded-2xl p-6 hover:shadow-md transition-shadow bg-background/50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-border pb-4">
                                        <div>
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Order ID</p>
                                            <p className="text-foreground font-mono font-medium">{order._id}</p>
                                        </div>
                                        <div className="mt-2 md:mt-0 text-left md:text-right">
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-600' :
                                                order.orderStatus === 'cancelled' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
                                                }`}>
                                                {order.orderStatus.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    <p className="font-extrabold text-lg text-foreground mt-4">Total: <span className="text-primary">${order.totalAmount.toFixed(2)}</span></p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
