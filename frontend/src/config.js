
// URL base correcta
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:4000'  // Asegúrate que este puerto coincida con el del backend en debug
  : 'https://thunder-rugs-backend.onrender.com';

const config = {
  API_URL
};

export default config; 