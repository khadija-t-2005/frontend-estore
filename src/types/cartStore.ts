// src/types/cart.types.ts  ← CE FICHIER MANQUE
export interface CartItemDTO {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartDTO {
  id: string;
  userId: string;
  items: CartItemDTO[];
  totalAmount: number;
}

export interface AddToCartDTO {
  productId: string;
  quantity: number;
}