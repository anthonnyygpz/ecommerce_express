import { Response } from "express";
import db from "../config/db.ts";

export const isExistsEmail = async (email: string, res: Response) => {
  const queryText = 'SELECT 1 FROM users WHERE email = $1';
  const queryParams = [email];
  const { rows } = await db.query(queryText, queryParams);

  if (rows.length > 0) {
    return res.status(400).json({ error: "Ya existe este correo." });
  }

  return null;
}


export const isExistsUsername = async (username: string, res: Response) => {
  const queryText = 'SELECT 1 FROM users WHERE username = $1';
  const queryParams = [username];
  const { rows } = await db.query(queryText, queryParams);

  if (rows.length > 0) {
    return res.status(400).json({ error: "Ya existe este nombre de usuario." });
  }
  return null;
}

export const isUserActive = async () => {

}
