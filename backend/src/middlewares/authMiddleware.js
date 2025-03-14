const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const defineAbilityFor = require('../utils/defineAbilities');

// Middleware para proteger rutas
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Obtener el token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token
      req.user = await User.findById(decoded.id).select('-password');
      
      // Definir habilidades para el usuario actual
      req.ability = defineAbilityFor(req.user);

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

// Middleware para verificar permisos usando CASL
const authorize = (action, subject) => {
  return (req, res, next) => {
    try {
      if (req.ability && req.ability.can(action, subject)) {
        next();
      } else {
        res.status(403).json({ 
          message: `No tienes permiso para ${action} ${subject}` 
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: 'Error en la verificación de permisos', 
        error: error.message 
      });
    }
  };
};

// Middleware para rutas de administrador
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'No autorizado como administrador' });
  }
};

module.exports = { protect, admin, authorize };
