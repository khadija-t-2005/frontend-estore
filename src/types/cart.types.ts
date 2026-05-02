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