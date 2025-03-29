const Product = require('../models/productModel');
const mongoose = require('mongoose');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Público
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    // Añadir logs detallados para diagnóstico
    console.log('Consulta MongoDB:', { keyword, page, pageSize });
    
    const count = await Product.countDocuments({ ...keyword });
    console.log('Total de productos en MongoDB:', count);
    
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    
    console.log('Productos encontrados:', products.length);
    console.log('Primer producto:', products[0] ? products[0]._id : 'Ninguno');

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error('Error en getProducts:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Público
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Crear un producto
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
      isFeatured,
      additionalImages,
      dimensions,
      material,
      technique
    } = req.body;

    // Validar campos requeridos
    if (!name || !image || !brand || !category || !description) {
      return res.status(400).json({ 
        message: 'Por favor complete todos los campos obligatorios' 
      });
    }

    const product = new Product({
      name,
      price: Number(price) || 0,
      user: req.user._id,
      image,
      additionalImages: additionalImages || [],
      brand,
      category,
      countInStock: Number(countInStock) || 0,
      numReviews: 0,
      description,
      isFeatured: Boolean(isFeatured),
      dimensions,
      material,
      technique
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ 
      message: 'Error al crear el producto', 
      error: error.message 
    });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Privado/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Crear nueva reseña
// @route   POST /api/products/:id/reviews
// @access  Privado
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Verificar si el usuario ya ha hecho una reseña
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Ya has reseñado este producto' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Reseña agregada' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener productos destacados
// @route   GET /api/products/featured
// @access  Público
const getFeaturedProducts = async (req, res) => {
  try {
    console.log('Buscando productos destacados...');
    
    // Buscar productos destacados
    let featuredProducts = await Product.find({ isFeatured: true })
      .limit(6)
      .populate('category');
    
    // Si no hay productos destacados o son menos de 4, obtener los más recientes
    if (featuredProducts.length < 4) {
      console.log(`Solo se encontraron ${featuredProducts.length} productos destacados. Obteniendo los más recientes...`);
      
      // Obtener productos más recientes (excluyendo los que ya tenemos)
      const featuredIds = featuredProducts.map(p => p._id);
      
      const recentProducts = await Product.find({
        _id: { $nin: featuredIds }
      })
        .sort({ createdAt: -1 })
        .limit(6 - featuredProducts.length)
        .populate('category');
      
      // Combinar ambos conjuntos
      featuredProducts = [...featuredProducts, ...recentProducts];
      
      console.log(`Se agregaron ${recentProducts.length} productos recientes.`);
    }
    
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error en getFeaturedProducts:', error);
    res.status(500).json({ 
      message: 'Error al obtener productos destacados', 
      error: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getFeaturedProducts,
};
