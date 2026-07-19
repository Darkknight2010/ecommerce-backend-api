const express = require('express');
const {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const getSessionId = require('../middleware/getSessionId');
const router = express.Router();
router.use(getSessionId);
router.route('/').get(getAllOrders).post(createOrder);
router.route('/:id').get(getOrder);
router.route('/:id/status').patch(updateOrderStatus);
module.exports = router;