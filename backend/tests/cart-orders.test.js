const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const { createApp } = require('../app');

function uniqueEmail() {
  return `test_${Date.now()}_${Math.floor(Math.random() * 1e6)}@example.com`;
}

async function registerAndLogin(app, email) {
  const password = 'secret123';
  await request(app).post('/api/auth/register').send({ username: 'TestUser', email, password });
  const login = await request(app).post('/api/auth/login').send({ email, password });
  return login.body.token;
}

describe('Cart and Orders auth + operations', () => {
  it('requires auth for cart and orders routes', async () => {
    const prisma = new PrismaClient();
    const app = createApp({ prisma });

    expect((await request(app).get('/api/cart/me')).statusCode).toBe(401);
    expect((await request(app).post('/api/orders/create').send({})).statusCode).toBe(401);

    await prisma.$disconnect();
  });

  it('can add cart item, update quantity, place and cancel order', async () => {
    const prisma = new PrismaClient();
    const app = createApp({ prisma });

    const token = await registerAndLogin(app, uniqueEmail());

    const added = await request(app)
      .post('/api/cart/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Tee', size: 'M', quantity: 1, price: 100, discount: 0 });
    expect(added.statusCode).toBe(201);

    const updated = await request(app)
      .patch(`/api/cart/${added.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 2 });
    expect(updated.statusCode).toBe(200);
    expect(updated.body.quantity).toBe(2);

    const order = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'A',
        email: 'a@a.com',
        mobile: '9999999999',
        address: 'addr',
        pincode: '000000',
        paymentMethod: 'cod',
        items: [{ title: 'Tee', size: 'M', quantity: 1, price: 100, discount: 0 }],
      });
    expect(order.statusCode).toBe(201);
    expect(Array.isArray(order.body)).toBe(true);

    const orderId = order.body[0].id;
    const getOne = await request(app).get(`/api/orders/${orderId}`).set('Authorization', `Bearer ${token}`);
    expect(getOne.statusCode).toBe(200);

    const cancelled = await request(app)
      .put(`/api/orders/${orderId}/cancel`)
      .set('Authorization', `Bearer ${token}`);
    expect(cancelled.statusCode).toBe(200);
    expect(cancelled.body.orderStatus).toBe('cancelled');

    await prisma.$disconnect();
  });
});

