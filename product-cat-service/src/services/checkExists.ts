import { Response } from "express";
import db from "../config/db";

export const isProductExist = async (productName: string, res: Response) => {
  const queryText = "SELECT * FROM product_catalog WHERE name ILIKE $1"
  const queryParams = [`%${productName}%`];
  const { rows } = await db.query(queryText, queryParams);

  if (rows.length > 0) {
    return res.status(400).json({ error: "Ya existe este producto." });
  }
  return null
}

export const isProductInactive = async (res: Response) => {
  const queryText = "SELECT * FROM product_catalog WHERE status = 'inactive'"
  const { rows } = await db.query(queryText);

  if (rows.length > 0) {
    return res.status(404).json({ error: "No se encontro el producto." });
  }
  return null
}
