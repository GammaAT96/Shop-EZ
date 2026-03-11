require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

function createApp({ prisma }) {
  const app = express();

  const isProd = process.env.NODE_ENV === 'production';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: isProd && allowedOrigins.length ? allowedOrigins : true,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: isProd ? 300 : 999999,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/api/health', async (req, res) => {
    try {
      await prisma.$connect();
      res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
      res.status(503).json({ status: 'error', database: err.message });
    }
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/banner', bannerRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/users', userRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found.' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Server error' });
  });

  return app;
}

module.exports = { createApp };
