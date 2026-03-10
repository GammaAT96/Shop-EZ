const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        // Total orders
        const totalOrders = await Order.countDocuments();

        // Total Revenue
        const orders = await Order.find();
        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += order.totalAmount;
        });

        // Total Products
        const totalProducts = await Product.countDocuments();

        // Total Users
        const totalUsers = await User.countDocuments();

        // Sales over time (grouping for charts)
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalProducts,
            totalUsers,
            salesData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
