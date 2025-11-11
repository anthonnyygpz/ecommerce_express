interface MessageAndError {
  message?: string;
  error?: string;
}

export interface CreateOrderBody {
  shipping_method_id: number;
  recipient_name: string;
  street: string;
  line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  subtotal_cents: number;
  cost_cents: number;
  taxes_cents: number;
  total_cents: number;
  currency: string;
}

export interface CreateOrderResponse extends MessageAndError {
  data?: { order_id: number; total_cents: number };
}

export interface CreatePromise {
  order_id: number;
  total_cents: number;
}
