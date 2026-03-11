const { prisma } = require('../config/db');

const getAnalytics = async (req, res) => {
  try {
    const [usersCount, productsCount, orders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany({
        select: { orderStatus: true, price: true, discount: true, quantity: true },
      }),
    ]);

    const statusCounts = orders.reduce((acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
      return acc;
    }, {});

    const grossRevenue = orders.reduce((sum, o) => sum + Number(o.price || 0) * Number(o.quantity || 0), 0);
    const discountTotal = orders.reduce((sum, o) => sum + Number(o.discount || 0) * Number(o.quantity || 0), 0);
    const netRevenue = Math.max(0, grossRevenue - discountTotal);

    res.json({
      usersCount,
      productsCount,
      ordersCount: orders.length,
      statusCounts,
      revenue: { gross: grossRevenue, discount: discountTotal, net: netRevenue },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAnalytics };

