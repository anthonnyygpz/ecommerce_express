export interface CartSchema {
  cart_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}


export interface CartItemSchema {
  cart_item_id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price_at_addition_cents: number;
  added_at: string;
}
