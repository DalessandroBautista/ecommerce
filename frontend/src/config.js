// Para Create React App
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Para Vite
// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// O una solución más sencilla sin variables de entorno
// const API_URL = 'http://localhost:5000';

// URL base correcta
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4000'  // Asegúrate que este puerto coincida con el del backend en debug
  : 'https://api.tudominio.com';

const config = {
  API_URL
};

export default config; 