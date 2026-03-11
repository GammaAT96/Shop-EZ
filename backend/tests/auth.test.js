const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { createApp } = require('../app');

function uniqueEmail() {
  return `test_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
}

describe('Auth', () => {
  it('registers and logs in a user', async () => {
    const prisma = new PrismaClient();
    const app = createApp({ prisma });

    const email = uniqueEmail();
    const password = 'secret123';

    const reg = await request(app).post('/api/auth/register').send({
      username: 'TestUser',
      email,
      password,
    });
    expect(reg.statusCode).toBe(201);
    expect(reg.body.token).toBeTruthy();
    expect(reg.body.user.email).toBe(email);

    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeTruthy();

    const me = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(me.statusCode).toBe(200);
    expect(me.body.user.email).toBe(email);

    await prisma.$disconnect();
  });
});

