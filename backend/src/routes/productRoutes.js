const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getFeaturedProducts,
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Ruta para productos destacados - DEBE IR ANTES que la ruta con :id
router.get('/featured', getFeaturedProducts);

// Rutas generales
router.route('/')
  .get(getProducts)
  .post(protect, authorize('create', 'Product'), createProduct);

// Ruta para obtener/actualizar/eliminar producto por ID
router.route('/:id')
  .get(getProductById)
  .delete(protect, authorize('delete', 'Product'), deleteProduct)
  .put(protect, authorize('update', 'Product'), updateProduct);

// Ruta para reviews
router.route('/:id/reviews')
  .post(protect, authorize('create', 'Review'), createProductReview);

module.exports = router;