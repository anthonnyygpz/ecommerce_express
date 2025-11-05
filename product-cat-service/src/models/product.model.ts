
export interface ProductModel {
  product_id: number;
  name: string;
  description: string;
  price_cents: number;
  stock: number;
  status: string;
  created_at: string;
  updated_at: string;
  count: string;
}

export interface CreateProductBody {
  name: string;
  description: string;
  price_cents: number;
  stock: number;
}

export interface UpdateProductBody {
  name: string;
  description: string;
  price_cents: number;
  stock: number;
  status: string;
}

export interface PaginationMeta {
  totalCount?: number;
  totalPages?: number;
  currentPages?: number;
  pageSize?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  message?: string;
  error?: string;
  products?: ProductModel[];
  pagination?: PaginationMeta;
}

