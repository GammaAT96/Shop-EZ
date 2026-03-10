const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

const sendOrderEmail = async (email, order) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
            port: process.env.EMAIL_PORT || 587,
            auth: {
                user: process.env.EMAIL_USER || 'test@ethereal.email',
                pass: process.env.EMAIL_PASS || 'password'
            }
        });

        await transporter.sendMail({
            from: '"ShopEZ" <no-reply@shopez.com>',
            to: email,
            subject: 'Order Confirmation - ShopEZ',
            text: `Thank you for your order! Your order ID is ${order._id}. Total amount: $${order.totalAmount}.`
        });
    } catch (err) {
        console.error("Failed to send order email", err);
    }
};

// Create new order
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, totalAmount, shippingDetails, paymentMethod } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            // Check stock first
            for (const item of orderItems) {
                const product = await Product.findById(item.productId);
                if (product) {
                    if (product.stock < item.quantity) {
                        return res.status(400).json({ message: `Insufficient stock for product ID: ${item.productId}` });
                    }
                } else {
                    return res.status(404).json({ message: `Product not found: ${item.productId}` });
                }
            }

            // Decrement Stock
            for (const item of orderItems) {
                const product = await Product.findById(item.productId);
                product.stock -= item.quantity;
                await product.save();
            }

            const order = new Order({
                userId: req.user._id,
                products: orderItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    size: item.size
                })),
                shippingDetails,
                paymentMethod,
                totalAmount
            });

            const createdOrder = await order.save();

            if (req.user && req.user.email) {
                sendOrderEmail(req.user.email, createdOrder);
            }

            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('userId', 'name email').populate('products.productId', 'name image');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (ADMIN)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'id name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (ADMIN)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.orderStatus = req.body.orderStatus || order.orderStatus;
            order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus };
