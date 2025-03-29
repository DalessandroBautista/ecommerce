const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Category = require('./models/categoryModel');
const categories = require('./data/categories');

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado para importar categorías'))
  .catch((error) => console.error(`Error: ${error.message}`));

const importCategories = async () => {
  try {
    // Opcional: limpiar categorías existentes
    // await Category.deleteMany();
    
    // Encontrar el usuario administrador
    const adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.error('No se encontró un usuario administrador');
      process.exit(1);
    }
    
    // Preparar las categorías con el ID del admin
    const categoriesWithAdmin = categories.map((category) => {
      return { ...category, user: adminUser._id };
    });
    
    // Insertar las categorías
    const createdCategories = await Category.insertMany(categoriesWithAdmin);
    
    console.log(`${createdCategories.length} categorías importadas!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importCategories(); 