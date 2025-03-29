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
    // Verificar si el usuario es administrador
    if (!req.user || !req.user.isAdmin) {
      console.log('Usuario no autorizado:', req.user);
      return res.status(403).json({ message: 'No autorizado: Se requiere permisos de administrador' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Registrar los datos recibidos para depuración
    console.log('Datos recibidos para actualización:', req.body);
    
    // Actualizar los campos
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;

    // Guardar el producto actualizado
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
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
    
    // Buscar productos destacados sin populate para evitar errores
    let featuredProducts = await Product.find({ isFeatured: true })
      .limit(6);
    
    console.log(`Se encontraron ${featuredProducts.length} productos destacados`);
    
    // Si no hay productos destacados o son menos de 4, obtener los más recientes
    if (featuredProducts.length < 4) {
      // Usar un array vacío si no hay productos destacados
      const featuredIds = featuredProducts.length > 0 
        ? featuredProducts.map(p => p._id) 
        : [];
      
      // Buscar productos recientes sin el populate inicialmente
      const recentProducts = await Product.find(
        featuredIds.length > 0 ? { _id: { $nin: featuredIds } } : {}
      )
        .sort({ _id: -1 }) // Usar _id en vez de createdAt para mayor compatibilidad
        .limit(6 - featuredProducts.length);
      
      // Combinar ambos conjuntos
      featuredProducts = [...featuredProducts, ...recentProducts];
      
      console.log(`Se agregaron ${recentProducts.length} productos recientes.`);
    }
    
    // Asegurarse de que featuredProducts sea siempre un array
    if (!Array.isArray(featuredProducts)) {
      featuredProducts = [];
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
