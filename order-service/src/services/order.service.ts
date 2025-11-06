import { OrderSchema } from "shared/schemas";
import db from "../config/db";
import { CreateOrderBody } from "../models/order.model";

export const fetchOrders = async (userId: number | string) => {
  try {
    const queryText = "SELECT * FROM orders WHERE user_id = $1";
    const queryParams = [userId];
    const { rows } = await db.query(queryText, queryParams);

    return rows || [];
  } catch (error) {
    throw error;
  }
}

export const createOrder = async (userId: number | string, data: CreateOrderBody) => {
  const { shipping_method_id, recipient_name, street, line_2, city, state, postal_code, country, cost_cents, subtotal_cents, total_cents, taxes_cents, currency } = data;

  try {
    const query = `
            SELECT * FROM create_order(
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
            )
        `;

    const params = [
      userId,                   // p_user_id
      shipping_method_id,       // p_shipping_method_id
      recipient_name,           // p_shipping_recipient_name
      street,                   // p_shipping_street_address
      line_2,                   // p_shipping_address_line_2
      city,                     // p_shipping_city
      state,                    // p_shipping_state_province
      postal_code,              // p_shipping_postal_code
      country,                  // p_shipping_country
      subtotal_cents,           // p_subtotal_cents
      cost_cents,               // p_shipping_cost_cents
      taxes_cents,              // p_taxes_cents
      total_cents,              // p_total_cents
      currency                  // p_currency
    ];

    const result = await db.query<OrderSchema>(query, params);
    const newOrder = result.rows[0]; // ¡La orden creada!

    return { order_id: newOrder.order_id, total_cents: newOrder.total_cents }

  } catch (error) {
    throw error;
  }
}

