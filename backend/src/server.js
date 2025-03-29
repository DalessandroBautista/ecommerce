const express = require('express');
const app = express();
const debugRoutes = require('./routes/debugRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
// ... existing routes ...
if (process.env.NODE_ENV !== 'production') {
  // Solo disponible en desarrollo
  app.use('/api/debug', debugRoutes);
}

app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// ... existing code ... 