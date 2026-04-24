import axios from 'axios';
import { API_BASE_URL } from '../config/api.config';
import { useAuthStore } from '../store/authStore.ts';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Injection automatique du token JWT
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion centralisée des erreurs Spring Boot
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    if (status === 403) {
      // GlobalExceptionHandler → accès refusé
    }
    if (status === 404) {
      // ResourceNotFoundException du backend
    }
    if (status === 409) {
      // InsufficientStockException du backend
    }

    return Promise.reject({ status, message });
  }
);