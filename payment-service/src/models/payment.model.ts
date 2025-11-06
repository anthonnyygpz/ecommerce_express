export interface CreatePaymentBody {
  orderId: number;
  amountCents: number;
  currency: string;
  paymentMethodType: string;
}

export interface UpdatePaymentBody {
  paymentId: number;
  gatewayTransactionId?: string;
  // error?: string;
}
