const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  handleWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Ruta para crear intención de pago (requiere autenticación)
router.route('/create-payment-intent')
  .post(protect, createPaymentIntent);

// Ruta para webhooks de Stripe (pública)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;