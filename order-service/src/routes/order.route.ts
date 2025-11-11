import { Router, Request, Response } from "express";
import {
  createOrder,
  fetchOrderById,
  fetchOrders,
} from "../services/order.service";
import { isAuthenticated } from "../middleware/checkAuth";
import { CreateOrderBody, CreateOrderResponse } from "../models/order.model";

const router: Router = Router();

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userIdFromSession = req.session.userId;

    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario." });
    }
    const order = await fetchOrders(userIdFromSession);
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});

router.get("/:order_id", isAuthenticated, async (req, res) => {
  const orderId = req.params.order_id;
  const userIdFromSession = req.session.userId;

  if (!userIdFromSession) {
    return res.status(404).json({ error: "No se encontro el usuario." });
  }
  try {
    const order = await fetchOrderById(userIdFromSession, orderId);
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});

router.post(
  "/",
  isAuthenticated,
  async (
    req: Request<{}, {}, CreateOrderBody>,
    res: Response<CreateOrderResponse>,
  ) => {
    try {
      const userIdFromSession = req.session.userId;
      if (!userIdFromSession) {
        return res.status(404).json({ error: "No se encontro el usuario" });
      }

      const data = await createOrder(userIdFromSession, req.body);

      if (!data) {
        return res.status(400).json({ error: "No se pudo crear la orden" });
      }
      res
        .status(200)
        .json({ message: "Se creo exitosamente la orden", data: data });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);

export default router;
