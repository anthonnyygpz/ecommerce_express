export interface CartModel {
  cart_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}


export interface CartItemModel {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price_at_addition_cents: number;
  added_at: string;
}


export interface CreateCartBody {
  product_id: number;
  quantity: number;
  price_cents: number;
}

type AggregatedCartItem = Pick<CartItemModel, 'cart_item_id' | 'product_id' | 'quantity'>;

export type CartSuccessResponse = CartModel & {
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
