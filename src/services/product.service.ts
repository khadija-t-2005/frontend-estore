import api from '../middleware/axios.interceptor';

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  categoryName: string;
  imageUrl?: string;
}

export interface ProductDetailDTO extends ProductDTO {
  // champs supplémentaires si le backend les renvoie
}

export interface ProductFilterDTO {
  name?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}

const productService = {
  // GET /api/products  → List<ProductDTO>
  getAll: () =>
    api.get<ProductDTO[]>('/products'),

  // GET /api/products/:id  → ProductDetailDTO
  getById: (id: number) =>
    api.get<ProductDetailDTO>(`/products/${id}`),

  // GET /api/products/search?name=...&categoryId=...&minPrice=...&maxPrice=...
  search: (params: ProductFilterDTO) =>
    api.get<ProductDTO[]>('/products/search', { params }),

  // Raccourci recherche par nom (compatibilité avec l'ancien code)
  searchByName: (name: string) =>
    api.get<ProductDTO[]>('/products/search', { params: { name } }),
};

export default productService;