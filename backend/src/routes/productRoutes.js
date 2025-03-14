const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Rutas públicas y protegidas
router.route('/')
  .get(getProducts)
  .post(protect, authorize('create', 'Product'), createProduct);

router.route('/:id/reviews')
  .post(protect, authorize('create', 'Review'), createProductReview);

router.route('/:id')
  .get(getProductById)
  .delete(protect, authorize('delete', 'Product'), deleteProduct)
  .put(protect, authorize('update', 'Product'), updateProduct);

module.exports = router;