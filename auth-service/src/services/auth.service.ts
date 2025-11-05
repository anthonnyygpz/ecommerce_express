import bcrypt from "bcryptjs";
import db from "../config/db.ts";
import { CreateUserBody, LoginUserBody } from "../models/user.ts";

export const createUser = async (data: CreateUserBody) => {
  const { email, username, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);
  const queryText = 'INSERT INTO users(username, email,password_hashed) VALUES($1, $2, $3) RETURNING *';
  const queryParams = [username, email, hashedPassword];

  const { rows } = await db.query(queryText, queryParams);


  const newUser = rows[0];

  delete newUser.password_hashed;
  delete newUser.updated_at;
  delete newUser.created_at;
  delete newUser.address_id;

  return newUser;
}


export const login = async (data: LoginUserBody) => {
  const { email } = data;

  const queryText = "SELECT * FROM users WHERE email = $1 AND status = 'active'";
  const queryParams = [email];
  const { rows } = await db.query(queryText, queryParams);

  const user = rows[0];

  return user;
}

