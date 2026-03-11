const { prisma } = require('../config/db');

const getBanner = async (req, res) => {
  try {
    let admin = await prisma.admin.findFirst();
    if (!admin) {
      admin = await prisma.admin.create({ data: { banner: null, categories: [] } });
    }
    res.json({ banner: admin.banner, categories: admin.categories || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { banner, categories } = req.body;
    let admin = await prisma.admin.findFirst();
    if (!admin) {
      admin = await prisma.admin.create({ data: { banner: banner ?? null, categories: categories ?? [] } });
    } else {
      admin = await prisma.admin.update({
        where: { id: admin.id },
        data: {
          ...(banner !== undefined && { banner }),
          ...(categories !== undefined && { categories: Array.isArray(categories) ? categories : admin.categories }),
        },
      });
    }
    res.json({ banner: admin.banner, categories: admin.categories || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBanner, updateBanner };
