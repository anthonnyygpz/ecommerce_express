import db from "../config/db";
import { CreateShippingBody } from "../models/shipping.model";
import { ShipmentSchema } from "shared/schemas";

export const fetchShippings = async (orderId: number | string) => {
  try {
    const queryText = "SELECT * FROM shipments WHERE order_id = $1"
    const queryParams = [orderId];
    const { rows } = await db.query<ShipmentSchema>(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;
  }
}

export const createShipping = async (data: CreateShippingBody) => {
  const { order_id, shipping_method_id } = data;

  try {
    const queryText = "SELECT * FROM create_shipment($1, $2)";
    const queryParams = [order_id, shipping_method_id]
    const { rows } = await db.query(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;
  }
}
