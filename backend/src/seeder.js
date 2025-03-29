const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');
const users = require('./data/users');
const products = require('./data/products');
const categories = require('./data/categories');

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado para importar datos'))
  .catch((error) => console.error(`Error: ${error.message}`));

const importData = async () => {
  try {
    // Limpiar bases de datos existentes
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    // Insertar usuarios
    const createdUsers = await User.insertMany(users);
    const adminUserId = createdUsers[0]._id;

    // Insertar categorías y guardar referencias
    const createdCategories = await Category.insertMany(
      categories.map(category => ({
        ...category,
        user: adminUserId
      }))
    );

    // Crear un mapa de nombres de categoría a IDs
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    // Por defecto, si no se encuentra la categoría, usar la primera categoría
    const defaultCategoryId = createdCategories[0]._id;

    // Mapear productos con las referencias correctas de categoría
    const productsWithCategories = products.map(product => {
      // Intentar buscar un nombre similar en las categorías
      let categoryId = defaultCategoryId;
      
      // Mapeo manual de categorías de ejemplo a tus categorías reales
      const categoryMapping = {
        'electrónica': 'moderna',
        'accesorios': 'artesanal'
      };
      
      const normalizedCategory = product.category.toLowerCase();
      const mappedCategory = categoryMapping[normalizedCategory] || normalizedCategory;
      
      if (categoryMap[mappedCategory]) {
        categoryId = categoryMap[mappedCategory];
      }
      
      return {
        ...product,
        user: adminUserId,
        category: categoryId,
        // Convertir URLs relativas a absolutas (opcional)
        image: product.image.startsWith('/') 
          ? `https://example.com${product.image}` 
          : product.image
      };
    });

    // Insertar productos
    await Product.insertMany(productsWithCategories);

    console.log('Datos importados correctamente!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('Datos eliminados correctamente!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}