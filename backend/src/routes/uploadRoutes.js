const express = require('express');
const router = express.Router();
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { upload } = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

// Ruta para subir imágenes
router.post('/', protect, admin, upload.single('image'), uploadImage);

// Ruta para eliminar imágenes
router.delete('/:publicId', protect, admin, deleteImage);

router.post('/', protect, async (req, res) => {
  try {
    // Lógica para guardar la imagen
    // Devolver la URL de la imagen
    res.json({ imageUrl: 'url_de_la_imagen' });
  } catch (error) {
    res.status(500).json({ message: 'Error al subir imagen' });
  }
});

module.exports = router; 