const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  createPayment,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Rutas protegidas
router.route('/')
  .post(protect, authorize('create', 'Order'), createOrder)
  .get(protect, authorize('read', 'all'), getOrders);

router.route('/myorders')
  .get(protect, authorize('read', 'Order'), getMyOrders);

router.route('/:id')
  .get(protect, authorize('read', 'Order'), getOrderById);

router.route('/:id/pay')
  .put(protect, authorize('update', 'Order'), updateOrderToPaid);

router.route('/:id/deliver')
  .put(protect, authorize('update', 'Order'), updateOrderToDelivered);

router.route('/:id/create-payment')
  .post(protect, authorize('update', 'Order'), createPayment);

module.exports = router;
