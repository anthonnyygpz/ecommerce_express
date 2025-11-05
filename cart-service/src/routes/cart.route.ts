import { Router, Request, Response } from "express"
import { addToCart, fetchCart } from "../services/cart.service";
import { CreateCartBody, } from "../models/cart.model";
import { isAuthenticated } from "../middleware/checkAuth";

const router: Router = Router();

router.get('/', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userIdFromSession = req.session.userId;

    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario" })
    }
    const cart = await fetchCart(userIdFromSession)

    if (!cart) {
      return res.status(404).json({ error: "No hay carrito." })
    }
    res.status(200).json({ cart: cart })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})


router.post('/', isAuthenticated, async (req: Request<CreateCartBody>, res: Response) => {
  const { product_id, quantity, price_cents } = req.body;
  if (!product_id || !quantity || !price_cents) {
    return res.status(400).json({ error: "Faltan campos" })
  }
  try {
    const userIdFromSession = req.session.userId;

    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro al usuario" })
    }

    await addToCart(userIdFromSession, req.body)
    res.status(201).json({ message: "Se agrego al carrito exitosamente." })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

export default router;
