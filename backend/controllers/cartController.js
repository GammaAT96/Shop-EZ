const Cart = require('../models/Cart');

// Get user cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
        if (!cart) {
            cart = { products: [] };
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            // Check if product exists in cart
            const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                // Update quantity
                cart.products[itemIndex].quantity = quantity;
            } else {
                // Add new item
                cart.products.push({ productId, quantity });
            }
            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create new cart
            const newCart = await Cart.create({
                userId: req.user._id,
                products: [{ productId, quantity }]
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding to cart' });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.id;
        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            cart.products = cart.products.filter(p => p.productId.toString() !== productId);
            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update item in cart
const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user._id });

        if (cart) {
            const itemIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.products[itemIndex].quantity = quantity;
                cart = await cart.save();
                return res.status(200).json(cart);
            } else {
                return res.status(404).json({ message: 'Product not found in cart' });
            }
        } else {
            return res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartItem };
