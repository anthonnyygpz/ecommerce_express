import db from "../config/db";
import bcrypt from "bcryptjs";
import { UpdateUserBody } from "../models/user.model";
import { UserSchema } from "shared/schemas";

export const fetchMe = async (userId: number | string) => {
  try {

    const queryText = "SELECT * FROM users WHERE user_id = $1";
    const queryParams = [userId];
    const { rows } = await db.query<UserSchema>(queryText, queryParams);

    if (!rows[0]) {
      return null;
    }

    delete rows[0].password_hashed;

    return rows[0];
  } catch (error) {
    throw error;
  }
}


export const updateUser = async (userId: number | string, data: UpdateUserBody) => {
  const { username, address_id, password } = data;

  const setClauses = []; // Almacenará ej: "username = $1", "address_id = $2"
  const params = [];     // Almacenará los valores: ["nuevoUsuario", 2]
  let paramIndex = 1;    // Contador para los placeholders ($1, $2, ...)

  // Solo añade campos a la consulta si fueron proporcionados
  if (username !== undefined) {
    setClauses.push(`username = $${paramIndex}`);
    params.push(username);
    paramIndex++;
  }

  if (address_id !== undefined) {
    setClauses.push(`address_id = $${paramIndex}`);
    params.push(address_id);
    paramIndex++;
  }

  if (password) {
    // Solo hashea si se proporciona una nueva contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    setClauses.push(`password_hashed = $${paramIndex}`);
    params.push(passwordHash);
    paramIndex++;
  }

  // Si no se proporcionó ningún dato para actualizar, no hagas nada.
  if (setClauses.length === 0) {
    // Opcionalmente, podrías devolver el usuario actual sin cambios
    // o lanzar un error. Por ahora, devolvemos null.
    return null;
  }


  // Añade 'updated_at' automáticamente
  setClauses.push('updated_at = NOW()');

  // El ID del usuario siempre es el último parámetro
  params.push(userId);
  const whereClause = `WHERE user_id = $${paramIndex}`;

  // Combina las partes en una sola consulta
  const queryText = `
    UPDATE users
    SET ${setClauses.join(', ')}
    ${whereClause}
    RETURNING user_id, username, address_id, status, created_at, updated_at
  `;

  try {
    const { rows } = await db.query(queryText, params);

    return rows[0] || null;

  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    throw err;
  }
}


export const softDeleteUser = async (userId: number | string) => {
  try {
    const queryText = "UPDATE users SET status = 'inactive', updated_at = NOW() WHERE user_id = $1 RETURNING user_id status";
    const queryParams = [userId];
    const { rows } = await db.query(queryText, queryParams);
    return rows[0] || null;
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    throw error;
  }
}
