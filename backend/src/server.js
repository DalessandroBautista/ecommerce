const express = require('express');
const cors = require('cors');
const app = express();
const debugRoutes = require('./routes/debugRoutes');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS específica para producción
app.use(cors({
  origin: [
    'https://thunder-rugs.vercel.app',
    'https://thunder-rugs-git-main.vercel.app',
    // Cualquier otra URL de Vercel que uses
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Manejo explícito de OPTIONS (preflight)
app.options('*', cors());

// Middleware de logging (colocar AQUÍ, después de CORS pero antes de las rutas)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rutas
// ... existing routes ...
if (process.env.NODE_ENV !== 'production') {
  // Solo disponible en desarrollo
  app.use('/api/debug', debugRoutes);
}

app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// ... existing code ... 