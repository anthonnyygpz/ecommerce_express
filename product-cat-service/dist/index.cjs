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
var import_connect_redis = require("connect-redis");
var import_express2 = __toESM(require("express"), 1);
var import_express_session = __toESM(require("express-session"), 1);
var import_morgan = __toESM(require("morgan"), 1);
var import_redis = require("redis");

// src/routes/product.ts
var import_express = require("express");
var router = (0, import_express.Router)();
router.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "productos" });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});
router.post("/");
router.put("/");
router.delete("/");
var product_default = router;

// src/index.ts
var redisClient = (0, import_redis.createClient)({
  url: process.env.REDIS_URL || "redis://redis-service:6379"
});
redisClient.connect().catch(console.error);
var redisStore = new import_connect_redis.RedisStore({ client: redisClient, prefix: "session" });
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
app.use("/api/product-catalog", product_default);
app.listen(3e3, () => {
  console.log("Server up of product-catalog-service http://localhost:3003");
});
//# sourceMappingURL=index.cjs.map