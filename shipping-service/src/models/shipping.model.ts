export interface FetchShippingBody {
  orderId: number;
}

export interface CreateShippingBody {
  order_id: number;
  shipping_method_id: number;
}
