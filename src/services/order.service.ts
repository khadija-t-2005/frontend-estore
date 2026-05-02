import api from '../middleware/axios.interceptor';

export interface OrderDTO {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
}

export interface OrderDetailDTO extends OrderDTO {
  items: {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface OrderStatusDTO {
  orderId: number;
  status: string;
}

const orderService = {
  // GET /api/orders/user/:userId  → List<OrderDTO>
  getUserOrders: (userId: number) =>
    api.get<OrderDTO[]>(`/orders/user/${userId}`),

  // GET /api/orders/:orderId  → OrderDetailDTO
  getById: (orderId: number) =>
    api.get<OrderDetailDTO>(`/orders/${orderId}`),

  // POST /api/orders/checkout/:userId  → OrderDTO
  checkout: (userId: number) =>
    api.post<OrderDTO>(`/orders/checkout/${userId}`),

  // PUT /api/orders/status  body: { orderId, status }
  updateStatus: (dto: OrderStatusDTO) =>
    api.put('/orders/status', dto),
};

export default orderService;
