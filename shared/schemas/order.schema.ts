export interface OrderSchema {
  order_id: number;
  user_id: number;
  payment_id: number;
  shipping_id: number;
  shipping_recipient_name: string;
  shipping_street_address: string;
  shipping_address_line_2: string;
  shipping_city: string;
  shipping_state_province: string;
  shipping_postal_code: string;
  shipping_country: string;
  status: string;
  tracking_number: number;
  subtotal_cents: number;
  shipping_cost_cents: number;
  taxes_cents: number;
  total_cents: number;
  currency: string;
  created_at: string;
  updated_at: string;
}
