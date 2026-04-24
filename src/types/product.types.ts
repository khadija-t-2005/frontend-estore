// Miroir de ProductDTO.java / CategoryDTO.java / ProductFilterRequest.java

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  category: CategoryDTO;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPageDTO {
  content: ProductDTO[];
  totalElements: number;
  totalPages: number;
  number: number;       // page courante (0-indexed)
  size: number;
}

export interface ProductFilterParams {
  categoryId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;        // ex: "price,asc" | "name,desc"
}