const Category = require('../models/categoryModel');

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Público
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener una categoría por ID
// @route   GET /api/categories/:id
// @access  Público
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Crear una categoría
// @route   POST /api/categories
// @access  Privado/Admin
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({ message: 'La categoría ya existe' });
    }

    const category = new Category({
      name,
      description,
      user: req.user._id,
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Actualizar una categoría
// @route   PUT /api/categories/:id
// @access  Privado/Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Eliminar una categoría
// @route   DELETE /api/categories/:id
// @access  Privado/Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.deleteOne();
      res.json({ message: 'Categoría eliminada' });
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
