const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

// Ruta para subir imágenes
router.post('/', protect, admin, upload.single('image'), uploadImage);

// Ruta para eliminar imágenes
router.delete('/:publicId', protect, admin, deleteImage);

module.exports = router; 