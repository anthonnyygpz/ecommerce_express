import { Router, Response, Request } from "express";
import { isAuthenticated } from "../middleware/checkAuth";
import {
  createAddress,
  fetchAddress,
  fetchDefaultAddress,
} from "../services/address.service";
import {
  AddressResponse,
  CreateAddressBody,
  CreateAddressResponse,
  DefaultAddressResponse,
} from "../models/address.model";

const router: Router = Router();

router.get(
  "/",
  isAuthenticated,
  async (req: Request, res: Response<AddressResponse>) => {
    try {
      const userIdFromSession = req.session.userId;
      if (!userIdFromSession) {
        return res.status(404).json({ error: "No se encontro el usuario." });
      }
      const address = await fetchAddress(userIdFromSession);
      res.status(200).json({ data: address });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);

router.get(
  "/default/",
  isAuthenticated,
  async (req: Request, res: Response<DefaultAddressResponse>) => {
    try {
      const userIdFromSession = req.session.userId;
      if (!userIdFromSession) {
        return res.status(404).json({ error: "No se encontro el usuario." });
      }
      const address = await fetchDefaultAddress(userIdFromSession);
      res.status(200).json({ data: address });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);

router.post(
  "/",
  isAuthenticated,
  async (
    req: Request<{}, {}, CreateAddressBody>,
    res: Response<CreateAddressResponse>,
  ) => {
    try {
      const userIdFromSession = req.session.userId;

      if (!userIdFromSession) {
        return res.status(404).json({ error: "No se encotnro el usuario." });
      }
      const data = await createAddress(userIdFromSession, req.body);
      res
        .status(201)
        .json({ message: "Se creo la dirección exitosamente.", data: data });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);
export default router;
