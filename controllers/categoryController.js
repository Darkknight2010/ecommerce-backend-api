const Category = require('../models/Category');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/apiResponse');
exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  sendResponse(res, 200, 'Categories retrieved successfully', categories);
});
exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  sendResponse(res, 200, 'Category retrieved successfully', category);
});
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  sendResponse(res, 201, 'Category created successfully', category);
});
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  sendResponse(res, 200, 'Category updated successfully', category);
});
exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new AppError('Category not found', 404);
  }
  sendResponse(res, 200, 'Category deleted successfully', null);
});