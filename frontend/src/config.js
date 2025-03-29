// Configuración base para la aplicación
const config = {
  // URL base de la API según el entorno
  API_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:4000'  // URL para desarrollo
    : 'https://thunder-rugs-backend.onrender.com',  // URL para producción
    
  // Configuración para axios
  axiosConfig: {
    baseURL: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:4000'  // URL para desarrollo
      : 'https://thunder-rugs-backend.onrender.com',  // URL para producción
    headers: {
      'Content-Type': 'application/json',
    },
  }
};

export default config; 