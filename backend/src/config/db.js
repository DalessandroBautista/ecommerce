const mongoose = require('mongoose');
const colors = require('colors'); // Opcional, para colorear la salida

// Función mejorada para conectar a MongoDB con depuración
const connectDB = async () => {
  try {
    console.log('Intentando conectar a MongoDB...'.yellow);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB conectado: ${conn.connection.host}`.green.underline);
    
    // Mostrar información detallada de la conexión
    console.log(`Base de datos: ${conn.connection.name}`.cyan);
    console.log(`Estado: ${conn.connection.readyState === 1 ? 'Conectado' : 'No conectado'}`.cyan);
    
    // Configurar listeners para eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error(`Error de MongoDB: ${err.message}`.red);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado'.yellow);
    });
    
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB; 