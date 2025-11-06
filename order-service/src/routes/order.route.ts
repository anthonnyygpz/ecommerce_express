import { Router, Request } from "express";
import { createOrder, fetchOrders } from "../services/order.service";
import { isAuthenticated } from "../middleware/checkAuth";
import { CreateOrderBody } from "../models/order.model";

const router: Router = Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userIdFromSession = req.session.userId;

    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario." });
    }
    const order = await fetchOrders(userIdFromSession);
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })

  }
});

router.post('/', isAuthenticated, async (req: Request<CreateOrderBody>, res) => {
  const { } = req.body;
  try {
    const userIdFromSession = req.session.userId;
    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario" })
    }

    await createOrder(userIdFromSession, req.body);
    res.status(200).json({ message: "Se creo exitosamente la orden" })

  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

export default router;
