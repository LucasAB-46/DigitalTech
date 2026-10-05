import axios from 'axios';

// 1. Creamos la instancia base apuntando a tu backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Ajustá esto si tu URL base es distinta
});

// 2. Interceptor de SOLICITUD (Request)
// Antes de que cualquier petición salga hacia Django, pasa por acá:
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Si hay token, lo adjuntamos en el formato que espera SimpleJWT
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (Opcional pero recomendado) Interceptor de RESPUESTA (Response)
// Si Django nos devuelve un 401 (Token expirado/inválido), deslogueamos al usuario
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el token venció, limpiamos todo y lo mandamos al login
      localStorage.clear();
      window.location.href = '/'; // Redirección forzada
    }
    return Promise.reject(error);
  }
);

export default api;