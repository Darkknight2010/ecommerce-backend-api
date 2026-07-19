const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/apiResponse');
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
exports.getAllProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  }
  if (req.query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }
  if (req.query.search) {
    const safeSearch = escapeRegex(req.query.search);
    filter.$or = [
      { name: { $regex: safeSearch, $options: 'i' } },
      { description: { $regex: safeSearch, $options: 'i' } },
    ];
  }
  const products = await Product.find(filter).populate('category', 'name');
  sendResponse(res, 200, 'Products retrieved successfully', products);
});
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    'category',
    'name description'
  );
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  sendResponse(res, 200, 'Product retrieved successfully', product);
});
exports.createProduct = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  const product = await Product.create(req.body);
  sendResponse(res, 201, 'Product created successfully', product);
});
exports.updateProduct = asyncHandler(async (req, res) => {
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  sendResponse(res, 200, 'Product updated successfully', product);
});
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new AppError('Product not found', 404);
  }
  sendResponse(res, 200, 'Product deleted successfully', null);
});