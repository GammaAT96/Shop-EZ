const { prisma } = require('../config/db');

const add = async (req, res) => {
  try {
    const { title, description, mainImg, size, quantity, price, discount } = req.body;
    const userId = req.user.id;
    if (!title || !size || quantity == null || price == null) {
      return res.status(400).json({ message: 'Required: title, size, quantity, price.' });
    }
    const item = await prisma.cart.create({
      data: {
        userId,
        title: title || '',
        description: description || '',
        mainImg: mainImg || '',
        size,
        quantity: Number(quantity) || 1,
        price: Number(price),
        discount: Number(discount) || 0,
      },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMine = async (req, res) => {
  try {
    const items = await prisma.cart.findMany({
      where: { userId: req.user.id },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const existing = await prisma.cart.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Cart item not found.' });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Not allowed.' });
    await prisma.cart.delete({ where: { id: req.params.id } });
    res.json({ message: 'Cart item removed.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const qty = Number(req.body.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      return res.status(400).json({ message: 'quantity must be an integer between 1 and 20.' });
    }
    const existing = await prisma.cart.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ message: 'Cart item not found.' });
    if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Not allowed.' });
    const updated = await prisma.cart.update({ where: { id: req.params.id }, data: { quantity: qty } });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { add, getMine, remove, updateQuantity };
