import pg, { QueryResult } from "pg";
import { UserModel } from "../models/user.model";

const { Pool } = pg;

const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: DB_PORT,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

const db = {
  query: (text: string, params?: any[]): Promise<QueryResult<UserModel>> => pool.query(text, params),
};

export default db;
