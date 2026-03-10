const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, default: 1 },
            size: { type: String }
        }
    ],
    shippingDetails: {
        name: { type: String },
        mobile: { type: String },
        email: { type: String },
        address: { type: String },
        pincode: { type: String }
    },
    paymentMethod: { type: String, default: 'card' },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    orderStatus: {
        type: String,
        enum: ['order placed', 'in-transit', 'Shipped', 'delivered', 'cancelled'],
        default: 'order placed'
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
