require('dotenv').config();
const { prisma } = require('./config/db');
const { createApp } = require('./app');

const PORT = process.env.PORT || 5000;

const app = createApp({ prisma });

app.listen(PORT, () => {
  console.log(`shopEZ API running on http://localhost:${PORT}`);
});
