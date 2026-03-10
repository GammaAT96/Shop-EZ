const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    discountPercentage: { type: Number, default: 0 },
    category: { type: String, required: true },
    gender: { type: String },
    sizes: [{ type: String }],
    thumbnailUrl: { type: String },
    imageUrls: [{ type: String }],
    rating: { type: Number, default: 0 },
    stock: { type: Number, default: 0 } // Preserving stock for vital cart functionality
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
