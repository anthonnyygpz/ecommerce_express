import express from "express";
import morgan from "morgan";
import session from 'express-session';
import { createClient } from "redis";
import { RedisStore } from "connect-redis";
import paymentRouter from "./routes/payment.route"

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis-service:6379'
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session',
});

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use(session({
  store: redisStore,
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));

app.use('/api/payments', paymentRouter);

app.listen(3000, () => {
  console.log("Server up of cart-service http://localhost:3006");
});


