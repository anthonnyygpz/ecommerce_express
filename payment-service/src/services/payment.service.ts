import db from "../config/db";
import { CreatePaymentBody, UpdatePaymentBody } from "../models/payment.model";
import { PaymentSchema } from "shared/schemas";

export const fetchPayments = async (userId: number | string) => {
  try {
    const queryText = "SELECT * FROM payments WHERE user_id = $1";
    const queryParams = [userId];
    const { rows } = await db.query<PaymentSchema>(queryText, queryParams);

    return rows || null;
  } catch (error) {
    throw error;
  }
};

export const createPayment = async (
  userId: number | string,
  data: CreatePaymentBody,
) => {
  const { orderId, amountCents, currency, paymentMethodType } = data;
  try {
    const queryText = "SELECT * FROM create_payment($1, $2, $3, $4, $5)";
    const queryParams = [
      orderId,
      userId,
      amountCents,
      currency,
      paymentMethodType,
    ];
    const { rows } = await db.query<PaymentSchema>(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const updatePaymentSucceeded = async (data: UpdatePaymentBody) => {
  const { paymentId, gatewayTransactionId } = data;
  try {
    const queryText = "SELECT * FROM fn_update_payment_succeeded($1, $2)";
    const queryParams = [paymentId, gatewayTransactionId];
    const { rows } = await db.query<PaymentSchema>(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};
