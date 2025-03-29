const mongoose = require('mongoose');

const checkDatabaseConnection = async () => {
  try {
    // Verificar estado actual de la conexión
    const state = mongoose.connection.readyState;
    /*
     * 0 = desconectado
     * 1 = conectado
     * 2 = conectando
     * 3 = desconectando
     */
    
    if (state === 1) {
      console.log('✅ Base de datos: Conectada exitosamente');
      return true;
    } 
    
    if (state === 2) {
      console.log('⏳ Base de datos: Conectando...');
      return false;
    }
    
    if (state === 0 || state === 3) {
      console.error('❌ Base de datos: No conectada. Estado:', state);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error al verificar conexión a base de datos:', error);
    return false;
  }
};

module.exports = { checkDatabaseConnection }; 