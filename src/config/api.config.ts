export const API_BASE_URL = 'http://localhost:8080/api';

export const ENDPOINTS = {
  auth: {
    login:    '/customer/auth/login', // AuthController [cite: 38]
    register: '/customer/auth/register',
  },
  products:  '/catalog/products',   // ProductController [cite: 65]
  inventory: '/inventory',          // InventoryController [cite: 93]
  cart:      '/shopping/cart',      // CartController [cite: 112]
  orders:    '/billing/orders',     // OrderController [cite: 136]
};