export interface ShipmentSchema {
  shipment_id: number;
  order_id: number;
  shipping_method_id: number;
  status: string;
  carrier_name: string;
  tracking_number: string;
  created_at: string;
  shipped_at: string;
  delivered_at: string;
}

export interface ShippingMethodSchema {
  shipping_method_id: number;
  name: string;
  description: string;
  cost_cents: number;
  carrtier_name: string;
  is_active: boolean;
}
