import express from "express";
import morgan from "morgan";
import session from "express-session";
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import routerAuth from "./routes/auth.ts";

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis-service:6379'
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session',
});

const app: express.Application = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use('/api/auth', routerAuth);



app.listen(3000, () => {
  console.log("Server up of auth-service http://localhost:3002")
});
