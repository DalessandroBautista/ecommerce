const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

// Inicializar app
const app = express();

// Configuración CORS para producción
const whitelist = [
  'https://thunder-rugs.vercel.app',
  'https://thunder-rugs-git-main.vercel.app',
  'https://thunder-rugs-yourname.vercel.app',
  'http://localhost:5173', 'http://localhost:3000'
  // Añade cualquier otro subdominio de Vercel que uses para preview
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como herramientas móviles o curl)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Origen bloqueado por CORS:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// Ruta especial para webhook de Stripe que necesita cuerpo raw
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('API ecommerce funcionando');
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  });
