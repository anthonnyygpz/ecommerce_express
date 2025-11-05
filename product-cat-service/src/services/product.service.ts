import db from "../config/db";
import { CreateProductBody, PaginationMeta, ProductModel, UpdateProductBody } from "../models/product.model";

export const fetchProducts = async (page: number, limit: number): Promise<{ products: ProductModel[], pagination: PaginationMeta }> => {
  const offset = (page - 1) * limit;

  try {
    const dataQueryText = "SELECT * FROM product_catalog ORDER BY name ASC LIMIT $1 OFFSET $2";
    const dataQueryParams = [limit, offset]

    const countQueryText = "SELECT COUNT(*) FROM product_catalog";

    const [dataResult, countResult] = await Promise.all([
      db.query(dataQueryText, dataQueryParams),
      db.query(countQueryText)
    ]);

    const products: ProductModel[] = dataResult.rows;
    const totalCount = parseInt(countResult.rows[0].count, 10);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;


    const pagination: PaginationMeta = {
      totalCount: totalCount,
      totalPages: totalPages,
      currentPages: page,
      pageSize: limit,
      hasNextPage: hasNextPage,
      hasPrevPage: hasPrevPage
    }

    return {
      products,
      pagination
    };
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (data: CreateProductBody): Promise<ProductModel | null> => {
  const { name, description, price_cents, stock } = data;
  try {
    const queryText = "INSERT INTO product_catalog (name, description, price_cents, stock) VALUES ($1, $2, $3, $4) RETURNING *";
    const queryParams = [name, description, price_cents, stock];

    const { rows } = await db.query(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error
  }
}

export const updateProduct = async (product_id: number, data: UpdateProductBody) => {
  const { name, description, price_cents, stock } = data;

  const setClauses = []; // Almacenará ej: "username = $1", "address_id = $2"
  const params = [];     // Almacenará los valores: ["nuevoUsuario", 2]
  let paramIndex = 1;    // Contador para los placeholders ($1, $2, ...)

  // Solo añade campos a la consulta si fueron proporcionados
  if (name !== undefined) {
    setClauses.push(`name = $${paramIndex}`);
    params.push(name);
    paramIndex++;
  }

  if (description !== undefined) {
    setClauses.push(`description = $${paramIndex}`);
    params.push(description);
    paramIndex++;
  }

  if (price_cents) {
    // Solo hashea si se proporciona una nueva contraseña
    setClauses.push(`price_cents = $${paramIndex}`);
    params.push(price_cents);
    paramIndex++;
  }

  if (stock !== undefined) {
    // Solo hashea si se proporciona una nueva contraseña
    setClauses.push(`stock = $${paramIndex}`);
    params.push(stock);
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
  params.push(product_id);
  const whereClause = `WHERE product_id = $${paramIndex}`;

  // Combina las partes en una sola consulta
  const queryText = `
    UPDATE product_catalog
    SET ${setClauses.join(', ')}
    ${whereClause}
    RETURNING product_id, name, description, status, created_at, updated_at
  `;

  try {
    const { rows } = await db.query(queryText, params);

    return rows[0] || null;

  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    throw err;
  }


}

export const softDeleteProduct = async (productId: number) => {
  try {

    const queryText = "UPDATE product_catalog SET status = 'inactive' WHERE product_id = $1 RETURNING product_id status";
    const queryParams = [productId];

    const { rows } = await db.query(queryText, queryParams);

    return rows[0] || null;
  } catch (error) {
    throw error;

  }
}
