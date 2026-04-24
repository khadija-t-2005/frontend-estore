import { apiClient } from '../middleware/axios.interceptor';
import { ENDPOINTS } from '../config/api.config';
import type { OrderDTO, OrderDetailDTO, CreateOrderRequest } from '../types/order.types';

export const orderService = {
  getAll: () =>
    apiClient.get<OrderDTO[]>(ENDPOINTS.orders).then(r => r.data),

  getById: (id: string) =>
    apiClient.get<OrderDetailDTO>(`${ENDPOINTS.orders}/${id}`).then(r => r.data),

  create: (payload: CreateOrderRequest) =>
    apiClient.post<OrderDTO>(ENDPOINTS.orders, payload).then(r => r.data),

  cancel: (id: string) =>
    apiClient.patch<OrderDTO>(`${ENDPOINTS.orders}/${id}/cancel`).then(r => r.data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`${ENDPOINTS.orders}/${id}/status`, { status }).then(r => r.data),
};