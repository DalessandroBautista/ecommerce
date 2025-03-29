const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// @desc    Verificar estado del servidor y DB
// @route   GET /api/debug/status
// @access  Público (solo desarrollo)
router.get('/status', (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const dbStatus = {
      connected: mongoose.connection.readyState === 1,
      state: ['Desconectado', 'Conectado', 'Conectando', 'Desconectando'][mongoose.connection.readyState],
      database: mongoose.connection.name || 'No disponible',
      host: mongoose.connection.host || 'No disponible'
    };
    
    // Información del servidor
    const serverInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.floor(process.uptime()) + ' segundos',
      memoryUsage: process.memoryUsage(),
      env: process.env.NODE_ENV || 'development'
    };
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      server: serverInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
  }
});

// @desc    Probar la ruta de productos destacados específicamente
// @route   GET /api/debug/featured-products
// @access  Público (solo desarrollo)
router.get('/featured-products', async (req, res) => {
  try {
    const Product = mongoose.model('Product');
    const products = await Product.find({ isFeatured: true }).limit(6);
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack
    });
  }
});

module.exports = router; 