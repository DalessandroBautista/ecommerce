import axios from 'axios';
import config from '../config';

// Crear instancia de axios con la configuración correcta
const api = axios.create({
  baseURL: config.API_URL || 'https://thunder-rugs-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api; 