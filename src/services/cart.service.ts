import api from '../middleware/axios.interceptor';

export interface CartItemDTO {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CartDTO {
  id: number;
  userId: number;
  items: CartItemDTO[];
}

export interface AddToCartDTO {
  productId: number;
  quantity: number;
}

const cartService = {
  // GET /api/cart/:userId  → CartDTO
  getCart: (userId: number) =>
    api.get<CartDTO>(`/cart/${userId}`),

  // POST /api/cart/:userId/add  body: { productId, quantity }  → CartDTO
  addToCart: (userId: number, productId: number, quantity: number) =>
    api.post<CartDTO>(`/cart/${userId}/add`, { productId, quantity } as AddToCartDTO),

  // DELETE /api/cart/item/:cartItemId  → 204
  removeItem: (cartItemId: number) =>
    api.delete(`/cart/item/${cartItemId}`),

  // DELETE /api/cart/:userId/clear  → 204
  clearCart: (userId: number) =>
    api.delete(`/cart/${userId}/clear`),
};

export default cartService;