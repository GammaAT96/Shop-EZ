const { prisma } = require('../config/db');

const ALLOWED_PAYMENT_METHODS = ['cod', 'card', 'upi', 'netbanking'];

const create = async (req, res) => {
  try {
    const { name, email, mobile, address, pincode, paymentMethod, items } = req.body;
    const userId = req.user.id;
    if (!name || !email || !mobile || !address || !pincode || !paymentMethod || !items?.length) {
      return res.status(400).json({ message: 'Required: name, email, mobile, address, pincode, paymentMethod, items array.' });
    }
    if (!ALLOWED_PAYMENT_METHODS.includes(String(paymentMethod).toLowerCase())) {
      return res.status(400).json({ message: `paymentMethod must be one of: ${ALLOWED_PAYMENT_METHODS.join(', ')}` });
    }
    const orderDate = new Date().toISOString();
    const orders = await Promise.all(
      items.map((it) =>
        prisma.order.create({
          data: {
            userId,
            name,
            email,
            mobile,
            address,
            pincode,
            title: it.title,
            description: it.description || '',
            mainImg: it.mainImg || '',
            size: it.size,
            quantity: Number(it.quantity) || 1,
            price: Number(it.price),
            discount: Number(it.discount) || 0,
            paymentMethod: String(paymentMethod).toLowerCase(),
            orderDate,
            orderStatus: 'order placed',
          },
        })
      )
    );
    res.status(201).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMine = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    const isOwner = order.userId === req.user.id;
    const isAdmin = req.user.usertype === 'admin';
    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not allowed.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const cancelMine = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    if (order.userId !== req.user.id) return res.status(403).json({ message: 'Not allowed.' });
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel an order with status: ${order.orderStatus}` });
    }
    const updated = await prisma.order.update({ where: { id: req.params.id }, data: { orderStatus: 'cancelled' } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['order placed', 'in-transit', 'delivered', 'cancelled'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({ message: 'Valid status: order placed, in-transit, delivered, cancelled.' });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { orderStatus: status },
    });
    res.json(order);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Order not found.' });
    res.status(500).json({ message: err.message });
  }
};

module.exports = { create, getMine, getById, cancelMine, getAll, updateStatus, ALLOWED_PAYMENT_METHODS };
