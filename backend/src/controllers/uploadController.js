const { cloudinary } = require('../config/cloudinary');
const Product = require('../models/productModel');

// @desc    Subir imagen a Cloudinary
// @route   POST /api/upload
// @access  Privado/Admin
const uploadImage = async (req, res) => {
  try {
    // El archivo ya fue procesado por multer y está disponible en req.file
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado ninguna imagen' });
    }

    res.json({
      message: 'Imagen subida con éxito',
      imageUrl: req.file.path,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ message: 'Error al subir imagen', error: error.message });
  }
};

// @desc    Eliminar imagen de Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Privado/Admin
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      res.json({ message: 'Imagen eliminada con éxito' });
    } else {
      res.status(400).json({ message: 'No se pudo eliminar la imagen' });
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    res.status(500).json({ message: 'Error al eliminar imagen', error: error.message });
  }
};

module.exports = { uploadImage, deleteImage }; 