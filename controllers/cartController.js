const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/apiResponse');
const calculateTotalPrice = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);
const getOrCreateCart = async (sessionId) => {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [], totalPrice: 0 });
  }
  return cart;
};
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.sessionId);
  await cart.populate({
    path: 'items.product',
    select: 'name description price stock category',
  });
  sendResponse(res, 200, 'Cart retrieved successfully', cart);
});
exports.addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    throw new AppError('Product ID is required', 400);
  }
  if (quantity <= 0) {
    throw new AppError('Quantity must be at least 1', 400);
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  if (product.stock <= 0) {
    throw new AppError('Product is out of stock', 400);
  }
  const cart = await getOrCreateCart(req.sessionId);
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );
  const requestedQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;
  if (requestedQuantity > product.stock) {
    throw new AppError(
      `Insufficient stock for ${product.name}. Available: ${product.stock}`,
      400
    );
  }
  if (existingItem) {
    existingItem.quantity = requestedQuantity;
    existingItem.price = product.price;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }
  cart.totalPrice = calculateTotalPrice(cart.items);
  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name description price stock category',
  });
  sendResponse(res, 200, 'Item added to cart successfully', cart);
});
exports.updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;
  if (quantity === undefined) {
    throw new AppError('Quantity is required', 400);
  }
  const cart = await getOrCreateCart(req.sessionId);
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === itemId
  );
  if (itemIndex === -1) {
    throw new AppError('Product not found in cart', 404);
  }
  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    const product = await Product.findById(itemId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    if (quantity > product.stock) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        400
      );
    }
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
  }
  cart.totalPrice = calculateTotalPrice(cart.items);
  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name description price stock category',
  });
  sendResponse(res, 200, 'Cart item updated successfully', cart);
});
exports.removeItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await getOrCreateCart(req.sessionId);
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === itemId
  );
  if (itemIndex === -1) {
    throw new AppError('Product not found in cart', 404);
  }
  cart.items.splice(itemIndex, 1);
  cart.totalPrice = calculateTotalPrice(cart.items);
  await cart.save();
  await cart.populate({
    path: 'items.product',
    select: 'name description price stock category',
  });
  sendResponse(res, 200, 'Item removed from cart successfully', cart);
});
exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.sessionId);
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();
  sendResponse(res, 200, 'Cart cleared successfully', cart);
});