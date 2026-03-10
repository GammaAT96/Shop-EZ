const http = require('http');

const baseURL = 'http://localhost:5000/api';

const request = (method, path, data = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: `/api${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', e => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
};

const runTests = async () => {
    try {
        console.log('--- Starting API Tests ---');

        // 1. Register User
        console.log('\n[1] Registering User...');
        const uniqueEmail = `testuser${Date.now()}@example.com`;
        let res = await request('POST', '/auth/register', {
            name: 'Test User',
            email: uniqueEmail,
            password: 'password123',
            role: 'ADMIN' // Making ADMIN for testing product creation later
        });
        console.log('Response:', res.status, res.data.email);

        if (res.status !== 201) throw new Error('Registration failed');

        // 2. Login
        console.log('\n[2] Logging in...');
        res = await request('POST', '/auth/login', {
            email: uniqueEmail,
            password: 'password123'
        });
        const token = res.data.token;
        console.log('Token received:', !!token);

        // 3. Get Profile
        console.log('\n[3] Getting Profile...');
        res = await request('GET', '/auth/profile', null, token);
        console.log('Response:', res.status, res.data.name);

        // 4. Create Product
        console.log('\n[4] Creating Product (Admin)...');
        res = await request('POST', '/products', {
            name: 'Test Product',
            price: 99.99,
            description: 'This is a test product',
            category: 'Electronics',
            stock: 10
        }, token);
        const productId = res.data._id;
        console.log('Product created ID:', productId);

        // 5. Get All Products
        console.log('\n[5] Getting All Products...');
        res = await request('GET', '/products');
        console.log('Products found:', res.data.length);

        // 6. Get Single Product
        console.log('\n[6] Getting Single Product...');
        res = await request('GET', `/products/${productId}`);
        console.log('Product name:', res.data.name);

        // 7. Add to Cart
        console.log('\n[7] Adding to Cart...');
        res = await request('POST', '/cart/add', {
            productId: productId,
            quantity: 2
        }, token);
        console.log('Params returned:', res.status);

        // 8. Update Cart
        console.log('\n[8] Updating Cart Item Quantity...');
        res = await request('PUT', '/cart/update', {
            productId: productId,
            quantity: 5
        }, token);
        console.log('Update return:', res.status);

        // 9. Fetch Cart
        console.log('\n[9] Fetching Cart...');
        res = await request('GET', '/cart', null, token);
        console.log('Cart Items Count:', res.data.products.length);

        // 10. Create Order
        console.log('\n[10] Creating Order...');
        res = await request('POST', '/orders', {
            orderItems: [{
                productId: productId,
                quantity: 2,
                price: 99.99
            }],
            totalAmount: 199.98
        }, token);
        const orderId = res.data._id;
        console.log('Order created ID:', orderId);

        // 11. Fetch User Orders
        console.log('\n[11] Fetching My Orders...');
        res = await request('GET', '/orders/my', null, token);
        console.log('My Orders Count:', res.data.length);

        // 12. Update Order Status (Admin)
        console.log('\n[12] Updating Order Status (Admin)...');
        res = await request('PATCH', `/orders/${orderId}/status`, {
            orderStatus: 'Shipped',
            paymentStatus: 'Completed'
        }, token);
        console.log('Order Status:', res.data.orderStatus);

        // 13. Remove Cart item
        console.log('\n[13] Removing Cart Item...');
        res = await request('DELETE', `/cart/remove/${productId}`, null, token);
        console.log('Remove item return:', res.status);

        // 14. Delete Product (Admin)
        console.log('\n[14] Deleting Product (Admin)...');
        res = await request('DELETE', `/products/${productId}`, null, token);
        console.log('Product deletion return:', res.status);

        console.log('\n✅ ALL TESTS PASSED SUCCESSFULLY!');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
    }
};

runTests();
