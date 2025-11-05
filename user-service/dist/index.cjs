"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/index.ts
var import_express2 = __toESM(require("express"), 1);
var import_morgan = __toESM(require("morgan"), 1);
var import_express_session = __toESM(require("express-session"), 1);

// src/routes/user.ts
var import_express = require("express");

// src/config/db.ts
var import_pg = __toESM(require("pg"), 1);
var { Pool } = import_pg.default;
var DB_PORT = parseInt(process.env.DB_PORT || "5432", 10);
var pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: DB_PORT,
  max: 20,
  idleTimeoutMillis: 3e4,
  connectionTimeoutMillis: 2e3
});
var db = {
  query: (text, params) => pool.query(text, params)
};
var db_default = db;

// src/services/user.service.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var updateUser = async (userId, data) => {
  const { username, address_id, password } = data;
  const setClauses = [];
  const params = [];
  let paramIndex = 1;
  if (username !== void 0) {
    setClauses.push(`username = $${paramIndex}`);
    params.push(username);
    paramIndex++;
  }
  if (address_id !== void 0) {
    setClauses.push(`address_id = $${paramIndex}`);
    params.push(address_id);
    paramIndex++;
  }
  if (password) {
    const passwordHash = await import_bcryptjs.default.hash(password, 10);
    setClauses.push(`password_hashed = $${paramIndex}`);
    params.push(passwordHash);
    paramIndex++;
  }
  if (setClauses.length === 0) {
    return null;
  }
  setClauses.push("updated_at = NOW()");
  params.push(userId);
  const whereClause = `WHERE user_id = $${paramIndex}`;
  const queryText = `
    UPDATE users
    SET ${setClauses.join(", ")}
    ${whereClause}
    RETURNING user_id, username, address_id, status, created_at, updated_at
  `;
  try {
    const { rows } = await db_default.query(queryText, params);
    return rows[0] || null;
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    throw err;
  }
};
var softDeleteUser = async (userId) => {
  try {
    const queryText = "UPDATE users SET status = 'inactive', updated_at = NOW() WHERE user_id = $1 RETURNING user_id status";
    const queryParams = [userId];
    const { rows } = await db_default.query(queryText, queryParams);
    return rows[0] || null;
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    throw error;
  }
};

// src/services/chekcExists.ts
var isExistsUsername = async (username) => {
  const queryText = "SELECT 1 FROM users WHERE username = $1";
  const queryParams = [username];
  const { rows } = await db_default.query(queryText, queryParams);
  return rows.length > 0;
};

// src/routes/user.ts
var import_middleware = require("shared/middleware");
var router = (0, import_express.Router)();
router.get("/me", import_middleware.isAuthenticated, (req, res) => {
  res.status(200).json({ id: req.session.userId, username: req.session.username });
});
router.put("/", import_middleware.isAuthenticated, async (req, res) => {
  const { username } = req.body;
  try {
    await isExistsUsername(username);
    const userIdFromSession = req.session.userId;
    if (userIdFromSession === void 0) {
      return res.status(400).json({ error: "El id del usuario no se encontro." });
    }
    await updateUser(userIdFromSession, req.body);
    res.status(200).json({ message: "Se actulizaron los datos exitaosamente." });
  } catch (error) {
    console.error("Error al actualizar los datos:", error);
    res.status(500).send({ error: `Error en el servidor: ${error}` });
  }
});
router.delete("/", import_middleware.isAuthenticated, async (req, res) => {
  try {
    const userIdFromSession = req.session.userId;
    if (userIdFromSession === void 0) {
      return res.status(400).json({ error: "El id del usuario no se encontro." });
    }
    const deleteUser = await softDeleteUser(userIdFromSession);
    if (!deleteUser) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error al cerrar despu\xE9s del soft delete:", err);
        return res.status(500).json({ error: "Usuario desactivado,pero fallo el cierre de sesi\xF3n." });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({
        message: "Usuario desactivado y sesi\xF3n cerrada exitosamente."
      });
    });
  } catch (error) {
    console.error("Error en el enpoint de soft delete:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});
var user_default = router;

// src/index.ts
var import_redis = require("redis");
var import_connect_redis = require("connect-redis");
var redisClient = (0, import_redis.createClient)({
  url: process.env.REDIS_URL || "redis://redis-service:6379"
});
redisClient.connect().catch(console.error);
var redisStore = new import_connect_redis.RedisStore({
  client: redisClient,
  prefix: "session"
});
var app = (0, import_express2.default)();
app.use(import_express2.default.json());
app.use((0, import_morgan.default)("dev"));
app.use((0, import_express_session.default)({
  store: redisStore,
  secret: process.env.SESSION_SECRET || "",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1e3 * 60 * 60 * 24
    // 1 día
  }
}));
app.use("/api/users", user_default);
app.listen(3e3, () => {
  console.log("Server up of user-service http://localhost:3001");
});
//# sourceMappingURL=index.cjs.map