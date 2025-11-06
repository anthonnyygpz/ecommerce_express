import { Router, Request } from "express";
import { isAuthenticated } from "../middleware/chekcAuth";
import { createPayment, fetchPayments, updatePaymentSucceeded } from "../services/payment.service";
import { CreatePaymentBody, UpdatePaymentBody } from "../models/payment.model";

const router: Router = Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userIdFromSession = req.session.userId;
    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario." });
    }

    const payment = await fetchPayments(userIdFromSession);
    res.status(200).json({ data: payment })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

router.post('/', isAuthenticated, async (req: Request<CreatePaymentBody>, res) => {
  const { orderId, amountCents, currency, paymentMethodType } = req.body;

  if (!orderId || !amountCents || !currency || !paymentMethodType) {
    return res.status(400).json({ error: "Faltan campos" })
  }
  try {
    const userIdFromSession = req.session.userId;

    if (!userIdFromSession) {
      return res.status(404).json({ error: "No se encontro el usuario." });
    }

    const payment = await createPayment(userIdFromSession, req.body);
    res.status(200).json({ data: payment })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

router.put('/', isAuthenticated, async (req: Request<UpdatePaymentBody>, res) => {
  const { paymentId, gatewayTransactionId } = req.body;
  if (!paymentId || !gatewayTransactionId) {
    return res.status(400).json({ error: "Faltan campos" })
  }
  try {
    const payment = await updatePaymentSucceeded(req.body);
    res.status(200).json({ data: payment })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

export default router;
