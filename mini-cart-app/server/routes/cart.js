const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All cart routes require a valid JWT
router.use(authMiddleware);

// POST /api/cart  { productId, quantity }
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    const populatedCart = await cart.populate('items.product');
    res.status(201).json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/cart - current user's cart with computed total
router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');

    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    const total = cart.items.reduce((sum, item) => {
      if (!item.product) return sum; // guard against deleted products
      return sum + item.product.price * item.quantity;
    }, 0);

    res.json({ items: cart.items, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:itemId - itemId is the cart sub-document id
router.delete('/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await cart.save();
    const populatedCart = await cart.populate('items.product');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
