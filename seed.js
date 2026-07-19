require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db/connectDB');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Order = require('./models/Order');
const seed = async () => {
  try {
    await connectDB();
    await Order.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Home furniture and decor',
      },
    ]);
    const [electronics, clothing, homeLiving] = categories;
    await Product.insertMany([
      {
        name: 'iPhone 14',
        description: 'Latest Apple smartphone with A15 Bionic chip',
        price: 799,
        stock: 10,
        category: electronics._id,
      },
      {
        name: 'Dell Laptop',
        description: 'High-performance laptop for work and gaming',
        price: 999,
        stock: 7,
        category: electronics._id,
      },
      {
        name: 'Men T-Shirt',
        description: 'Comfortable cotton t-shirt for everyday wear',
        price: 19,
        stock: 25,
        category: clothing._id,
      },
      {
        name: 'Blue Jeans',
        description: 'Classic fit denim jeans',
        price: 49,
        stock: 15,
        category: clothing._id,
      },
      {
        name: 'Sofa',
        description: 'Modern 3-seater sofa for your living room',
        price: 299,
        stock: 5,
        category: homeLiving._id,
      },
      {
        name: 'Table Lamp',
        description: 'Elegant desk lamp with adjustable brightness',
        price: 29,
        stock: 20,
        category: homeLiving._id,
      },
    ]);
    const productCount = await Product.countDocuments();
    const categoryCount = await Category.countDocuments();
    console.log(`Successfully seeded ${categoryCount} categories and ${productCount} products`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};
seed();