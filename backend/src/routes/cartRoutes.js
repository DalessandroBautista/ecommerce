const express = require('express');
const router = express.Router();
const { updateCart, getCart, mergeCart, getUserCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

// Ruta para crear/actualizar carrito (funciona con o sin autenticación)
router.route('/')
  .post(updateCart);

// Ruta para obtener carrito del usuario autenticado
router.route('/user')
  .get(protect, getUserCart);

// Ruta para fusionar carritos (requiere autenticación)
router.route('/merge')
  .post(protect, mergeCart);

// Ruta para obtener carrito por ID
router.route('/:cartId')
  .get(getCart);

module.exports = router;