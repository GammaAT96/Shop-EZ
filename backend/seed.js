const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

// Models
const Product = require('./models/Product');
const Category = require('./models/Category');

// Connect to DB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const categories = [
    { name: 'Men', description: 'Premium menswear collection for all seasons.' },
    { name: 'Women', description: 'Elegant and trendy womens fashion.' },
    { name: 'Accessories', description: 'Bags, watches, jewelry, and more.' }
];

const getProducts = (categoryIds) => [
    {
        name: 'The Essential White Tee',
        description: 'A meticulously crafted organic cotton t-shirt that holds its shape. Perfect for everyday wear or layering under a sleek jacket.',
        price: 35.00,
        stock: 50,
        category: categoryIds['Men'],
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1500' // White tee
    },
    {
        name: 'Midnight Denim Jacket',
        description: 'Classic fit denim jacket in a deep indigo wash. Features sturdy hardware and a versatile silhouette that never goes out of style.',
        price: 120.00,
        stock: 15,
        category: categoryIds['Men'],
        image: 'https://images.unsplash.com/photo-1548624147-36e765582236?auto=format&fit=crop&q=80&w=1500' // Denim jacket
    },
    {
        name: 'Cashmere Blend Sweater',
        description: 'Ultra-soft cashmere and merino wool blend sweater. This sophisticated piece brings unparalleled comfort to modern menswear.',
        price: 85.00,
        stock: 25,
        category: categoryIds['Men'],
        image: 'https://images.unsplash.com/photo-1614252339474-b4a11be074b7?auto=format&fit=crop&q=80&w=1500' // Sweater
    },
    {
        name: 'Silk Slip Dress',
        description: 'A breathtaking 100% silk slip dress. Features a flattering bias cut and delicate adjustable straps. The perfect statement piece for any evening.',
        price: 180.00,
        stock: 8,
        category: categoryIds['Women'],
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=1500' // Dress
    },
    {
        name: 'High-Waisted Tailored Trousers',
        description: 'Expertly tailored trousers providing a sleek, elongating silhouette. Crafted from a breathable wool blend ideal for both office and weekend wear.',
        price: 95.00,
        stock: 30,
        category: categoryIds['Women'],
        image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&q=80&w=1500' // Trousers
    },
    {
        name: 'Oversized Knit Cardigan',
        description: 'Cozy up in our chunky oversized knit cardigan. Hand-loomed with premium yarn, offering incredible warmth and a highly sought-after relaxed fit.',
        price: 110.00,
        stock: 0, // Out of stock example
        category: categoryIds['Women'],
        image: 'https://images.unsplash.com/photo-1516245041-02da5c3a3560?auto=format&fit=crop&q=80&w=1500' // Knit
    },
    {
        name: 'Minimalist Leather Tote',
        description: 'A spacious everyday tote bag crafted from full-grain Italian leather. Features a suede interior, internal zipper pocket, and durable brass hardware.',
        price: 250.00,
        stock: 12,
        category: categoryIds['Accessories'],
        image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=1500' // Bag
    },
    {
        name: 'Polarized Aviator Sunglasses',
        description: 'Timeless aviator frames crafted from aerospace-grade titanium. Features scratch-resistant polarized lenses that eliminate glare entirely.',
        price: 145.00,
        stock: 3, // Low stock example
        category: categoryIds['Accessories'],
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=1500' // Sunglasses
    },
    {
        name: 'Chronograph Steel Watch',
        description: 'Precision-engineered automatic chronograph watch. Features a sapphire crystal face, 100m water resistance, and a striking brushed steel bracelet.',
        price: 320.00,
        stock: 5, // Low stock example
        category: categoryIds['Accessories'],
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1500' // Watch
    }
];

const importData = async () => {
    try {
        await connectDB();

        // 1. Clear existing products and categories
        console.log('Clearing old data...');
        await Product.deleteMany();
        await Category.deleteMany();

        // 2. Insert Categories
        console.log('Inserting categories...');
        const createdCategories = await Category.insertMany(categories);

        // Map category names to their new generated ObjectIds
        const categoryIds = {};
        createdCategories.forEach(cat => {
            categoryIds[cat.name] = cat._id;
        });

        // 3. Insert Products
        console.log('Inserting products...');
        const productsWithIds = getProducts(categoryIds);
        await Product.insertMany(productsWithIds);

        console.log('\n✅ Data Imported Successfully!');
        console.log('You can now check your frontend storefront.');
        process.exit();

    } catch (error) {
        console.error(`\n❌ Error with import: ${error.message}`);
        process.exit(1);
    }
};

importData();
