import db from "../config/db";
import { CartFetchResult, CartSuccessResponse, CreateCartBody, UpdateProductQuantity } from "../models/cart.model";

export const fetchCart = async (userId: number | string): Promise<CartFetchResult | null> => {
  const queryText = `
    SELECT
      c.*, -- Trae todas las columnas de la tabla 'carts'
      COALESCE(
        json_agg(
          json_build_object(
            'item_id', ci.cart_item_id,
            'product_id', ci.product_id,
            'quantity', ci.quantity,
            'price_at_addition_cents', ci.price_at_addition_cents
          )
        ) FILTER (WHERE ci.cart_item_id IS NOT NULL),
        '[]'::json
      ) AS items
    FROM
      carts c
    LEFT JOIN
      cart_items ci ON c.cart_id = ci.cart_id
    WHERE
      c.user_id = $1
    GROUP BY
      c.cart_id;
  `;
  try {

    const { rows } = await db.query<CartSuccessResponse>(queryText, [userId]);

    if (rows.length === 0) {
      return {
        status: 'error',
        error: 'Cart not found for this user.'
      };
    }

    const cartData = rows[0];

    return {
      ...cartData,
      status: 'success'
    };
  } catch (error) {
    throw error;
  }
}


export const addToCart = async (userId: number | string, data: CreateCartBody) => {
  const { product_id, quantity, price_cents } = data;
  try {
    const queryText = "SELECT * FROM add_to_cart($1, $2, $3, $4)";
    const queryParams = [userId, product_id, quantity, price_cents];
    const { rows } = await db.query(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;
  }
}

export const updateProductQuantity = async (userId: number | string, data: UpdateProductQuantity) => {
  const { cart_id, quantity, product_id } = data;
  try {


    const queryText = "SELECT * FROM manage_cart_item($1, $2, $3, $4)";
    const queryParams = [cart_id, product_id, quantity, userId];

    const { rows } = await db.query(queryText, queryParams);

    return rows[0]
  } catch (error) {
    throw error;
  }


}

export const clearAllProduct = async (userId: number | string) => {
  try {
    const queryText = "DELETE FROM carts WHERE user_id = $1";
    const queryParams = [userId];
    const { rows } = await db.query(queryText, queryParams);
    return rows[0] || [];
  } catch (error) {
    throw error;
  }
}
