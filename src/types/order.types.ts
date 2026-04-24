// Miroir de OrderDTO.java / OrderDetailDTO.java / OrderStatusDTO.java

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemDTO {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDTO {
  id: string;
  userId: string;
  items: OrderItemDTO[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  shippingAddress: string;
}

export interface OrderDetailDTO extends OrderDTO {
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface CreateOrderRequest {
  cartId: string;
  shippingAddress: string;
  paymentMethod: string;
}