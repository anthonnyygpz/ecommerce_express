import { Router, Request } from "express";
import { CreateShippingBody } from "../models/shipping.model";
import { createShipping, fetchShippings } from "../services/shipping.service";

const router: Router = Router();

router.get('/', async (req, res) => {
  const { orderId } = req.body;
  try {
    const shipping = await fetchShippings(orderId);
    res.status(200).json({ data: shipping })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

router.post('/', async (req: Request<CreateShippingBody>, res) => {
  const { order_id, shipping_method_id } = req.body;

  if (!order_id || !shipping_method_id) {
    return res.status(400).json({ error: "Faltan campos" })
  }

  try {
    await createShipping(req.body);
    res.status(201).json({ message: "Se envio el producto." })
  } catch (error) {
    res.status(500).json({ error: `Error en el serviodr: ${error}` })
  }
})



export default router;

