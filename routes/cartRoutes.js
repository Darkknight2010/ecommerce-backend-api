const express = require('express');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
} = require('../controllers/cartController');
const getSessionId = require('../middleware/getSessionId');
const router = express.Router();
router.use(getSessionId);
router.route('/').get(getCart).post(addItem).delete(clearCart);
router.route('/:itemId').put(updateItem).delete(removeItem);
module.exports = router;