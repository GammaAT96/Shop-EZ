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
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-6 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40 relative z-10">
                        <User className="w-12 h-12" />
                    </div>
                    <div className="relative z-10 flex-grow">
                        <h1 className="text-3xl font-extrabold text-slate-900">{userInfo.username}</h1>
                        <p className="text-slate-500 font-medium mt-1">{userInfo.email}</p>
                        <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                            <ShieldCheck className="w-4 h-4 mr-1" /> {userInfo.role.toUpperCase()} ACCOUNT
                        </div>
                    </div>
                    <div className="relative z-10">
                        <button onClick={() => { logout(); navigate('/login'); }} className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-full hover:bg-red-100 transition-colors border border-red-100">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-slate-800">
                    <h2 className="text-2xl font-bold mb-6 flex items-center"><Package className="mr-3 text-blue-600" /> Order History</h2>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-2xl w-full"></div>)}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-700">No orders yet</h3>
                            <p className="text-slate-500 mt-2">When you place an order, it will appear here.</p>
                            <button onClick={() => navigate('/shop')} className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition">Start Shopping</button>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map((order) => (
                                <div key={order._id} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow bg-slate-50/30">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-slate-100 pb-4">
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Order ID</p>
                                            <p className="text-slate-800 font-mono font-medium">{order._id}</p>
                                        </div>
                                        <div className="mt-2 md:mt-0 text-left md:text-right">
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.orderStatus.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2">Ordered on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    <p className="font-extrabold text-lg text-slate-900 mt-4">Total: <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span></p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
