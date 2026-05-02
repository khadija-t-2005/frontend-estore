import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request: injecte le token JWT si disponible
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && token !== 'SUCCESS_TOKEN') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response: gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Erreur serveur';

    return Promise.reject(new Error(typeof message === 'string' ? message : JSON.stringify(message)));
  }
);

export default api;
