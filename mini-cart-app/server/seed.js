require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'Wireless Mouse', description: 'Ergonomic 2.4GHz wireless mouse', price: 799, category: 'Electronics', stock: 50, imageUrl: '' },
  { name: 'Bluetooth Headphones', description: 'Over-ear noise cancelling headphones', price: 2499, category: 'Electronics', stock: 30, imageUrl: '' },
  { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard', price: 3499, category: 'Electronics', stock: 20, imageUrl: '' },
  { name: 'USB-C Charging Cable', description: '1.5m fast-charging cable', price: 299, category: 'Electronics', stock: 100, imageUrl: '' },
  { name: 'Portable Power Bank', description: '10000mAh fast charging power bank', price: 1299, category: 'Electronics', stock: 40, imageUrl: '' },
  { name: 'Cotton T-Shirt', description: 'Plain round-neck cotton t-shirt', price: 499, category: 'Clothing', stock: 100, imageUrl: '' },
  { name: 'Denim Jacket', description: 'Classic blue denim jacket', price: 1999, category: 'Clothing', stock: 25, imageUrl: '' },
  { name: 'Running Shoes', description: 'Lightweight breathable running shoes', price: 2999, category: 'Clothing', stock: 35, imageUrl: '' },
  { name: 'Woolen Sweater', description: 'Warm winter sweater', price: 1499, category: 'Clothing', stock: 45, imageUrl: '' },
  { name: 'Baseball Cap', description: 'Adjustable cotton baseball cap', price: 399, category: 'Clothing', stock: 60, imageUrl: '' },
  { name: 'The Pragmatic Programmer', description: 'Classic software engineering book', price: 899, category: 'Books', stock: 15, imageUrl: '' },
  { name: 'Atomic Habits', description: 'Bestselling self-improvement book', price: 599, category: 'Books', stock: 50, imageUrl: '' },
  { name: 'Clean Code', description: 'A handbook of agile software craftsmanship', price: 999, category: 'Books', stock: 20, imageUrl: '' },
  { name: 'Ceramic Coffee Mug', description: '350ml microwave-safe mug', price: 299, category: 'Home', stock: 70, imageUrl: '' },
  { name: 'LED Desk Lamp', description: 'Adjustable brightness LED desk lamp', price: 899, category: 'Home', stock: 30, imageUrl: '' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await Product.deleteMany({});
    console.log('Existing products cleared');

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seed();
