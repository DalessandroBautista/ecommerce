const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const { v4: uuidv4 } = require('uuid');

// @desc    Crear o actualizar carrito
// @route   POST /api/cart
// @access  Público/Privado
const updateCart = async (req, res) => {
  try {
    const { cartId, items } = req.body;
    
    // Verificar si los productos existen y están en stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Producto ${item.product} no encontrado` });
      }
      if (product.countInStock < item.quantity) {
        return res.status(400).json({ 
          message: `Solo hay ${product.countInStock} unidades disponibles de ${product.name}` 
        });
      }
    }

    let cart;
    
    // Si hay cartId, buscar el carrito existente
    if (cartId) {
      cart = await Cart.findOne({ cartId });
    }
    
    // Si hay usuario autenticado, buscar su carrito
    if (req.user && !cart) {
      cart = await Cart.findOne({ user: req.user._id });
    }
    
    // Si no existe carrito, crear uno nuevo
    if (!cart) {
      const newCartId = cartId || uuidv4();
      cart = new Cart({
        cartId: newCartId,
        user: req.user ? req.user._id : null,
        items: [],
      });
    }
    
    // Si hay usuario autenticado, asignar el carrito a ese usuario
    if (req.user && !cart.user) {
      cart.user = req.user._id;
    }
    
    // Actualizar items del carrito
    cart.items = items;
    
    // Guardar carrito
    await cart.save();
    
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar carrito', error: error.message });
  }
};

// @desc    Obtener carrito
// @route   GET /api/cart/:cartId
// @access  Público
const getCart = async (req, res) => {
  try {
    let cart;
    
    // Si hay usuario autenticado, buscar su carrito
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    }
    
    // Si no hay carrito asociado al usuario o no hay usuario, buscar por cartId
    if (!cart && req.params.cartId) {
      cart = await Cart.findOne({ cartId: req.params.cartId });
    }
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carrito', error: error.message });
  }
};

// @desc    Fusionar carrito al iniciar sesión
// @route   POST /api/cart/merge
// @access  Privado
const mergeCart = async (req, res) => {
  try {
    const { cartId } = req.body;
    
    if (!cartId) {
      return res.status(400).json({ message: 'Se requiere cartId para fusionar' });
    }
    
    // Buscar carrito anónimo
    const anonymousCart = await Cart.findOne({ cartId });
    
    if (!anonymousCart) {
      return res.status(404).json({ message: 'Carrito anónimo no encontrado' });
    }
    
    // Buscar carrito del usuario
    let userCart = await Cart.findOne({ user: req.user._id });
    
    // Si el usuario no tiene carrito, convertir el anónimo en su carrito
    if (!userCart) {
      anonymousCart.user = req.user._id;
      await anonymousCart.save();
      return res.json(anonymousCart);
    }
    
    // Fusionar items
    const mergedItems = [...userCart.items];
    
    for (const anonymousItem of anonymousCart.items) {
      const existingItemIndex = mergedItems.findIndex(
        item => item.product.toString() === anonymousItem.product.toString()
      );
      
      if (existingItemIndex >= 0) {
        // Aumentar cantidad si el producto ya existe
        mergedItems[existingItemIndex].quantity += anonymousItem.quantity;
      } else {
        // Añadir nuevo item
        mergedItems.push(anonymousItem);
      }
    }
    
    // Actualizar carrito del usuario
    userCart.items = mergedItems;
    await userCart.save();
    
    // Eliminar carrito anónimo
    await anonymousCart.deleteOne();
    
    res.json(userCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al fusionar carritos', error: error.message });
  }
};

// @desc    Obtener carrito del usuario actual
// @route   GET /api/cart/user
// @access  Privado
const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.status(404).json({ message: 'No se encontró un carrito para este usuario' });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener carrito del usuario', error: error.message });
  }
};

module.exports = {
  updateCart,
  getCart,
  mergeCart,
  getUserCart,
};