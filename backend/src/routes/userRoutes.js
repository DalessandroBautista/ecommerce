const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  authUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Rutas públicas
router.post('/login', authUser);
router.post('/', registerUser);

// Rutas protegidas
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Rutas de administrador
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

module.exports = router;
