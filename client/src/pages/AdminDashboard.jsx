import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0,
        salesData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userInfo);
        if (parsedUser.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        setUser(parsedUser);

        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${parsedUser.token} `
                    }
                };
                const { data } = await axios.get('/api/analytics', config, { baseURL: 'http://localhost:5000' });
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

    if (!user) return null;

    const chartData = {
        labels: stats.salesData.map(data => data._id),
        datasets: [
            {
                label: 'Daily Revenue ($)',
                data: stats.salesData.map(data => data.totalSales),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Revenue Trends',
            },
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center border border-gray-100">
                    <h1 className="text-3xl font-extrabold text-gray-900">Admin Overview</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 font-medium">Welcome, {user.name}</span>
                        <button
                            onClick={() => {
                                localStorage.removeItem('userInfo');
                                navigate('/login');
                            }}
                            className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded hover:bg-red-100 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading dashboard...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                                <h3 className="text-gray-500 text-sm uppercase font-semibold tracking-wider">Total Revenue</h3>
                                <p className="text-3xl font-black text-gray-800 mt-2">${stats.totalRevenue.toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                                <h3 className="text-gray-500 text-sm uppercase font-semibold tracking-wider">Total Orders</h3>
                                <p className="text-3xl font-black text-gray-800 mt-2">{stats.totalOrders}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-purple-500"></div>
                                <h3 className="text-gray-500 text-sm uppercase font-semibold tracking-wider">Total Products</h3>
                                <p className="text-3xl font-black text-gray-800 mt-2">{stats.totalProducts}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500"></div>
                                <h3 className="text-gray-500 text-sm uppercase font-semibold tracking-wider">Total Users</h3>
                                <p className="text-3xl font-black text-gray-800 mt-2">{stats.totalUsers}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mt-6">
                            <Line options={chartOptions} data={chartData} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
