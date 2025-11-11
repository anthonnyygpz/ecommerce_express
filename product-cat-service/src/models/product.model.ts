import { ValidationError } from "express-validator";
import { ProductSchema } from "shared/schemas";

export interface MessageAndError {
  message?: string;
  error?: string | ValidationError[];
}

// Body
export interface CreateProductBody {
  name: string;
  description?: string;
  price_cents: number;
  stock: number;
  category: string;
  url_image: string;
}

export interface UpdateProductBody {
  name: string;
  description: string;
  price_cents: number;
  stock: number;
  status: string;
  category: string;
  url_image: string;
}
export interface ProductIdsBody {
  product_ids: number[];
}

// Params
export interface PaginationParams {
  page: number;
  limit: number;
}

// Metadata
export interface PaginationMeta {
  totalCount?: number;
  totalPages?: number;
  currentPages?: number;
  pageSize?: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Response
export interface ProductResponse extends MessageAndError {
  data?: ProductSchema[];
}

export interface PaginationProductResponse extends MessageAndError {
  data?: ProductSchema[];
  pagination?: PaginationMeta;
}
