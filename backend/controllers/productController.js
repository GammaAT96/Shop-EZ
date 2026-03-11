const { prisma } = require('../config/db');

function toNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

const getAll = async (req, res) => {
  try {
    const { category, gender, sort, q, minPrice, maxPrice, page, limit } = req.query;
    const where = {};
    if (category) where.category = category;
    if (gender) where.gender = gender;
    if (q) where.title = { contains: String(q), mode: 'insensitive' };
    const min = toNumber(minPrice);
    const max = toNumber(maxPrice);
    if (min !== undefined || max !== undefined) {
      where.price = {};
      if (min !== undefined) where.price.gte = min;
      if (max !== undefined) where.price.lte = max;
    }
    const orderBy = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';

    const pageNum = Math.max(1, Number(page) || 1);
    const take = Math.min(60, Math.max(1, Number(limit) || 12));
    const skip = (pageNum - 1) * take;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy: Object.keys(orderBy).length ? orderBy : { createdAt: 'desc' },
        skip,
        take,
      }),
    ]);

    res.json({ items: products, page: pageNum, limit: take, total, totalPages: Math.ceil(total / take) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, sizes, category, gender, price, discount } = req.body;
    const p = toNumber(price);
    const d = toNumber(discount) ?? 0;
    if (!title || !description || mainImg === undefined || !Array.isArray(sizes) || sizes.length === 0 || !category || !gender || p === undefined) {
      return res.status(400).json({ message: 'Required fields: title, description, mainImg, sizes, category, gender, price.' });
    }
    if (p < 0) return res.status(400).json({ message: 'Price must be >= 0.' });
    if (d < 0) return res.status(400).json({ message: 'Discount must be >= 0.' });
    const product = await prisma.product.create({
      data: {
        title,
        description,
        mainImg: mainImg || '',
        carousel: Array.isArray(carousel) ? carousel : [],
        sizes,
        category,
        gender,
        price: p,
        discount: d,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, sizes, category, gender, price, discount } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (mainImg !== undefined) data.mainImg = mainImg;
    if (carousel !== undefined) data.carousel = Array.isArray(carousel) ? carousel : [];
    if (sizes !== undefined) {
      if (!Array.isArray(sizes) || sizes.length === 0) return res.status(400).json({ message: 'sizes must be a non-empty array.' });
      data.sizes = sizes;
    }
    if (category !== undefined) data.category = category;
    if (gender !== undefined) data.gender = gender;
    if (price !== undefined) {
      const p = toNumber(price);
      if (p === undefined || p < 0) return res.status(400).json({ message: 'price must be a number >= 0.' });
      data.price = p;
    }
    if (discount !== undefined) {
      const d = toNumber(discount);
      if (d === undefined || d < 0) return res.status(400).json({ message: 'discount must be a number >= 0.' });
      data.discount = d;
    }
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });
    res.json(product);
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Product not found.' });
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Product not found.' });
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
