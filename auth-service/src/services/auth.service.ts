import bcrypt from "bcryptjs";
import db from "../config/db.ts";
import {
  CreateUserBody,
  LoginUserBody,
  LoginPromise,
  CreatePromise,
} from "../models/user.model.ts";
import { UserSchema } from "shared/schemas";

export const login = async (data: LoginUserBody): Promise<LoginPromise> => {
  const { email } = data;

  const queryText =
    "SELECT * FROM users WHERE email = $1 AND  status = 'active'";
  const queryParams = [email];
  const { rows } = await db.query<UserSchema>(queryText, queryParams);

  const result: LoginPromise = rows[0];

  return result;
};

export const createUser = async (
  data: CreateUserBody,
): Promise<CreatePromise | null> => {
  try {
    const { email, username, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText =
      "INSERT INTO users(username, email,password_hashed) VALUES($1, $2, $3) RETURNING user_id, username, email";
    const queryParams = [username, email, hashedPassword];

    const { rows } = await db.query<UserSchema>(queryText, queryParams);

    const result: CreatePromise = rows[0];

    return result || null;
  } catch (error) {
    throw error;
  }
};
