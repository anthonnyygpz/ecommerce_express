import db from "../config/db.ts";

export const isExistsEmail = async (email: string) => {
  const queryText = 'SELECT 1 FROM users WHERE email = $1';
  const queryParams = [email];
  const { rows } = await db.query(queryText, queryParams);

  return rows.length > 0;
}


export const isExistsUsername = async (username: string) => {
  const queryText = 'SELECT 1 FROM users WHERE username = $1';
  const queryParams = [username];
  const { rows } = await db.query(queryText, queryParams);

  return rows.length > 0;
}

export const isUserActive = async () => {

}
