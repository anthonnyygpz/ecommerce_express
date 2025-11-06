export interface PaymentSchema {
  payment_id: number;
  order_id: number;
  user_id: number;
  amount_cents: number;
  currency: string;
  status: string;
  payment_method_type: string;
  gateway_transaction_id: string;
  gateway_error_message?: string;
  created_at: string;
  updated_at: string;
}
