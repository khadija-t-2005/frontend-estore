import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import type { ProductFilterParams } from '../types/product.types';

// ─── Produits ───────────────────────────────────────────────

export const useProducts = (params?: ProductFilterParams) => {
  return useQuery({
    queryKey: ['products', params],   // re-fetch auto si params change
    queryFn: () => productService.getAll(params),
    placeholderData: (prev) => prev,  // garde les données précédentes pendant le chargement
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
};

export const useProductsByCategory = (
  categoryId: string,
  params?: Omit<ProductFilterParams, 'categoryId'>
) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, params],
    queryFn: () => productService.getByCategory(categoryId, params),
    enabled: !!categoryId,
  });
};

// ─── Catégories ─────────────────────────────────────────────

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productService.getAllCategories,
    staleTime: 1000 * 60 * 10, // catégories statiques → cache 10 min
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => productService.getCategoryById(id),
    enabled: !!id,
  });
};