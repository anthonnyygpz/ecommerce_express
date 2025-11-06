import { CartSchema, CartItemSchema } from "shared/schemas/cart.schema";

export interface CreateCartBody {
  product_id: number;
  quantity: number;
  price_cents: number;
}

type AggregatedCartItem = Pick<CartItemSchema, 'cart_item_id' | 'product_id' | 'quantity'>;

export type CartSuccessResponse = CartSchema & {
  status: 'success';
  items: AggregatedCartItem[];
};

type CartErrorResponse = {
  status: 'error';
  error: string;
};
export type CartFetchResult = CartSuccessResponse | CartErrorResponse;

export interface CartResponse {
  message?: string;
  error?: string;
}

export interface UpdateProductQuantity {
  cart_id: number;
  product_id: number;
  quantity: number
}
