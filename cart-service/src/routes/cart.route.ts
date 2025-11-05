import { Router, Request, Response } from "express"
import { addToCart, clearAllProduct, fetchCart, updateProductQuantity } from "../services/cart.service";
import { CreateCartBody, UpdateProductQuantity, } from "../models/cart.model";
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

router.put('/', isAuthenticated, async (req: Request<UpdateProductQuantity>, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Faltan campos" })
  }

  try {
    const userIdFromSession = req.session.userId;
    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario." });
    }

    await updateProductQuantity(userIdFromSession, req.body);
    res.status(200).json({ message: `Se agrego/removio ${quantity} en el producto ${product_id}.` });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })

  }
})

router.delete('/', isAuthenticated, async (req, res) => {
  try {
    const userIdFromSession = req.session.userId;
    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario." });
    }

    await clearAllProduct(userIdFromSession);
    res.status(200).json({ message: "Se eliminaron todos los productos del carrito." });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` });

  }
})

export default router;
