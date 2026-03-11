const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { createApp } = require('../app');

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const prisma = new PrismaClient();
    const app = createApp({ prisma });

    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');

    await prisma.$disconnect();
  });
});

