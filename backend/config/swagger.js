module.exports = {
  openapi: '3.0.0',
    info: {
      title: 'shopEZ API',
      version: '1.0.0',
      description: 'shopEZ e-commerce backend API',
    },
    servers: [{ url: 'http://localhost:5000', description: 'Development' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          summary: 'Health check',
          tags: ['Health'],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/api/auth/register': {
        post: {
          summary: 'Register user',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password'],
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' }, 400: { description: 'Bad request' } },
        },
      },
      '/api/auth/login': {
        post: {
          summary: 'Login',
          tags: ['Auth'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string' },
                    password: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/auth/me': {
        get: {
          summary: 'Get current user',
          tags: ['Auth'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/products': {
        get: {
          summary: 'List products',
          tags: ['Products'],
          parameters: [
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'gender', in: 'query', schema: { type: 'string' } },
            { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc'] } },
            { name: 'q', in: 'query', schema: { type: 'string' }, description: 'Search by title' },
            { name: 'minPrice', in: 'query', schema: { type: 'number' } },
            { name: 'maxPrice', in: 'query', schema: { type: 'number' } },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 60 } },
          ],
          responses: { 200: { description: 'OK' } },
        },
        post: {
          summary: 'Create product (admin)',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    mainImg: { type: 'string' },
                    carousel: { type: 'array', items: { type: 'string' } },
                    sizes: { type: 'array', items: { type: 'string' } },
                    category: { type: 'string' },
                    gender: { type: 'string' },
                    price: { type: 'number' },
                    discount: { type: 'number' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } },
        },
      },
      '/api/products/{id}': {
        get: {
          summary: 'Get product by id',
          tags: ['Products'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
        },
        put: {
          summary: 'Update product (admin)',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { type: 'object' } } } },
          responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
        },
        delete: {
          summary: 'Delete product (admin)',
          tags: ['Products'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not found' } },
        },
      },
      '/api/cart/add': {
        post: {
          summary: 'Add to cart',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    mainImg: { type: 'string' },
                    size: { type: 'string' },
                    quantity: { type: 'integer' },
                    price: { type: 'number' },
                    discount: { type: 'number' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/cart/me': {
        get: {
          summary: 'Get my cart',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/cart/{id}': {
        patch: {
          summary: 'Update cart item quantity',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object', required: ['quantity'], properties: { quantity: { type: 'integer', minimum: 1, maximum: 20 } } },
              },
            },
          },
          responses: { 200: { description: 'OK' }, 400: { description: 'Bad request' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } },
        },
        delete: {
          summary: 'Remove cart item',
          tags: ['Cart'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } },
        },
      },
      '/api/orders/create': {
        post: {
          summary: 'Place order',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' },
                    mobile: { type: 'string' },
                    address: { type: 'string' },
                    pincode: { type: 'string' },
                    paymentMethod: { type: 'string' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          title: { type: 'string' },
                          description: { type: 'string' },
                          mainImg: { type: 'string' },
                          size: { type: 'string' },
                          quantity: { type: 'integer' },
                          price: { type: 'number' },
                          discount: { type: 'number' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Created' } },
        },
      },
      '/api/orders/me': {
        get: {
          summary: 'Get my orders',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' } },
        },
      },
      '/api/orders/{id}': {
        get: {
          summary: 'Get order by id (owner/admin)',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
        },
      },
      '/api/orders/{id}/cancel': {
        put: {
          summary: 'Cancel my order',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'OK' }, 400: { description: 'Bad request' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' }, 404: { description: 'Not found' } },
        },
      },
      '/api/orders/all': {
        get: {
          summary: 'Get all orders (admin)',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/api/orders/status/{id}': {
        put: {
          summary: 'Update order status (admin)',
          tags: ['Orders'],
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', enum: ['order placed', 'in-transit', 'delivered', 'cancelled'] } },
                },
              },
            },
          },
          responses: { 200: { description: 'OK' } },
        },
      },
      '/api/banner': {
        get: {
          summary: 'Get banner and categories',
          tags: ['Banner'],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/api/banner/update': {
        put: {
          summary: 'Update banner and categories (admin)',
          tags: ['Banner'],
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    banner: { type: 'string' },
                    categories: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'OK' } },
        },
      },
      '/api/categories': {
        get: {
          summary: 'List categories (from Admin settings)',
          tags: ['Categories'],
          responses: { 200: { description: 'OK' } },
        },
      },
      '/api/analytics': {
        get: {
          summary: 'Admin analytics (counts and revenue)',
          tags: ['Analytics'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' }, 401: { description: 'Unauthorized' }, 403: { description: 'Forbidden' } },
        },
      },
      '/api/users': {
        get: {
          summary: 'List users (admin)',
          tags: ['Users'],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'OK' } },
        },
      },
    },
};
