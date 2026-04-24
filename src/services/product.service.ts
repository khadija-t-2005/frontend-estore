import { apiClient } from '../middleware/axios.interceptor';
import { ENDPOINTS } from '../config/api.config';
import type {
  ProductDTO,
  ProductPageDTO,
  CategoryDTO,
  ProductFilterParams,
} from '../types/product.types';

export const productService = {
  // GET /catalog/products?page=0&size=12&categoryId=...
  getAll: (params?: ProductFilterParams) =>
    apiClient
      .get<ProductPageDTO>(ENDPOINTS.products, { params })
      .then((r) => r.data),

  // GET /catalog/products/:id
  getById: (id: string) =>
    apiClient
      .get<ProductDTO>(`${ENDPOINTS.products}/${id}`)
      .then((r) => r.data),

  // GET /catalog/products?categoryId=:id  (raccourci sémantique)
  getByCategory: (categoryId: string, params?: Omit<ProductFilterParams, 'categoryId'>) =>
    apiClient
      .get<ProductPageDTO>(ENDPOINTS.products, { params: { ...params, categoryId } })
      .then((r) => r.data),

  // GET /catalog/categories
  getAllCategories: () =>
    apiClient
      .get<CategoryDTO[]>(ENDPOINTS.categories)
      .then((r) => r.data),

  // GET /catalog/categories/:id
  getCategoryById: (id: string) =>
    apiClient
      .get<CategoryDTO>(`${ENDPOINTS.categories}/${id}`)
      .then((r) => r.data),
};