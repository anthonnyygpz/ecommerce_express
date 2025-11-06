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
