const { prisma } = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const admin = await prisma.admin.findFirst();
    res.json({ categories: admin?.categories || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCategories };

