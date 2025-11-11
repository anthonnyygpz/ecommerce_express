import { AddressSchema } from "shared/schemas";
import db from "../config/db";
import { CreateAddressBody } from "../models/address.model";

export const fetchAddress = async (userId: number | string) => {
  try {
    const queryText = "SELECT * FROM addresses WHERE user_id = $1";
    const queryParams = [userId];
    const { rows } = await db.query<AddressSchema>(queryText, queryParams);

    return rows || [];
  } catch (error) {
    throw error;
  }
};

export const fetchDefaultAddress = async (userId: number | string) => {
  try {
    const queryText =
      "SELECT * FROM addresses WHERE user_id = $1 AND is_default = true";
    const queryParams = [userId];
    const { rows } = await db.query<AddressSchema>(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

export const createAddress = async (
  userId: number | string,
  data: CreateAddressBody,
) => {
  const {
    recipientName,
    streetAddress,
    addressLine2,
    city,
    stateProvince,
    postalCode,
    country,
    deliveryInstructions,
    phoneNumber,
    addressLabel,
    isDefault,
  } = data;

  try {
    const queryText = `SELECT * FROM create_user_address($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
    const queryParams = [
      userId,
      streetAddress,
      city,
      stateProvince,
      postalCode,
      country,
      isDefault,
      recipientName,
      addressLine2,
      deliveryInstructions,
      phoneNumber,
      addressLabel,
    ];
    const { rows } = await db.query<AddressSchema>(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};
