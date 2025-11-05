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
var import_redis = require("redis");
var import_connect_redis = require("connect-redis");

// src/routes/auth.ts
var import_express = require("express");
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);

// src/services/auth.service.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

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

// src/services/auth.service.ts
var createUser = async (data) => {
  const { email, username, password } = data;
  const hashedPassword = await import_bcryptjs.default.hash(password, 10);
  const queryText = "INSERT INTO users(username, email,password_hashed) VALUES($1, $2, $3) RETURNING *";
  const queryParams = [username, email, hashedPassword];
  const { rows } = await db_default.query(queryText, queryParams);
  const newUser = rows[0];
  delete newUser.password_hashed;
  delete newUser.updated_at;
  delete newUser.created_at;
  delete newUser.address_id;
  return newUser;
};
var login = async (data) => {
  const { email } = data;
  const queryText = "SELECT * FROM users WHERE email = $1 AND status = 'active'";
  const queryParams = [email];
  const { rows } = await db_default.query(queryText, queryParams);
  const user = rows[0];
  return user;
};

// src/services/chekcExists.ts
var isExistsEmail = async (email) => {
  const queryText = "SELECT 1 FROM users WHERE email = $1";
  const queryParams = [email];
  const { rows } = await db_default.query(queryText, queryParams);
  return rows.length > 0;
};
var isExistsUsername = async (username) => {
  const queryText = "SELECT 1 FROM users WHERE username = $1";
  const queryParams = [username];
  const { rows } = await db_default.query(queryText, queryParams);
  return rows.length > 0;
};

// src/routes/auth.ts
var router = (0, import_express.Router)();
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "El correo y la contrase\xF1a son obligatorios." });
  }
  try {
    const user = await login(req.body);
    if (!user) {
      return res.status(401).json({ error: "Credenciales inv\xE1lidas o cuenta inactiva" });
    }
    const match = await import_bcryptjs2.default.compare(password, user.password_hashed);
    if (!match) {
      return res.status(401).json({ error: "Credenciales inv\xE1lidas." });
    }
    req.session.userId = user.user_id;
    req.session.username = user.username;
    res.status(200).json({
      message: "Login exitoso",
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error al iniciar sesion:", error);
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Faltan los campos username, email o password" });
  }
  try {
    await isExistsEmail(email);
    await isExistsUsername(username);
    const newUser = await createUser(req.body);
    req.session.userId = newUser.user_id;
    req.session.username = newUser.username;
    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error al insertar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "No se pudo cerrar sesi\xF3n." });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Se cerro sesi\xF3n exitosamente." });
  });
});
var auth_default = router;

// src/index.ts
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
    maxAge: 1e3 * 60 * 60 * 24
  }
}));
app.use("/api/auth", auth_default);
app.listen(3e3, () => {
  console.log("Server up of auth-service http://localhost:3002");
});
//# sourceMappingURL=index.cjs.map