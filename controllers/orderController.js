const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/apiResponse');
 
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'CASH' } = req.body;
  if (
    !shippingAddress ||
    !shippingAddress.street ||
    !shippingAddress.city ||
    !shippingAddress.country
  ) {
    throw new AppError(
      'Shipping address with street, city, and country is required',
      400
    );
  }
  if (!['CASH', 'CARD'].includes(paymentMethod)) {
    throw new AppError('Payment method must be CASH or CARD', 400);
  }
 
  // Step 1: get the current cart — if it is empty, return an error
  const cart = await Cart.findOne({ sessionId: req.sessionId });
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }
 
  // Step 2 + 3: for every item, make sure the product still exists and has
  // enough stock, and calculate totalPrice server-side from the real product data
  const orderItems = [];
  let totalPrice = 0;
 
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
 
    if (!product) {
      throw new AppError(
        'One of the items in your cart is no longer available',
        404
      );
    }
 
    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        400
      );
    }
 
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });
 
    totalPrice += product.price * item.quantity;
  }
 
  // Step 4: create the order, saving name/price/quantity of every product
  const order = await Order.create({
    sessionId: req.sessionId,
    items: orderItems,
    totalPrice,
    shippingAddress,
    paymentMethod,
  });
 
  // Step 5: reduce the stock of every product by the requested quantity
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }
 
  // Step 6: empty the cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();
 
  // Step 7: return the new order
  sendResponse(res, 201, 'Order created successfully', order);
});
 
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ sessionId: req.sessionId }).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Orders retrieved successfully', orders);
});
 
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, sessionId: req.sessionId });
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  sendResponse(res, 200, 'Order retrieved successfully', order);
});
 
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    throw new AppError(
      `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      400
    );
  }
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) {
    throw new AppError('Order not found', 404);
  }
  sendResponse(res, 200, 'Order status updated successfully', order);
});