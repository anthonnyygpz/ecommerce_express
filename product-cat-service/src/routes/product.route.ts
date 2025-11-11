import { Router, Request, Response } from "express";
import {
  createProduct,
  fetchPaginationProduct,
  fetchProducts,
  softDeleteProduct,
  updateProduct,
} from "../services/product.service";
import {
  CreateProductBody,
  PaginationProductResponse,
  ProductIdsBody,
  ProductResponse,
  UpdateProductBody,
} from "../models/product.model";
import { isProductInactive } from "../services/checkExists";
import { isAuthenticated } from "../middleware/checkAuth";
import { valitedatePaginationParams } from "../middleware/paginationParams.validate";
import { validationResult } from "express-validator";
import { validateProductIds } from "../middleware/RequestBody.validate";

const router: Router = Router();

router.get(
  "/",
  valitedatePaginationParams,
  async (req: Request, res: Response<PaginationProductResponse>) => {
    // Parameters
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    // Validate Field
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const { products, pagination } = await fetchPaginationProduct(
        page,
        limit,
      );

      res.status(200).json({ data: products, pagination: pagination });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);

router.post(
  "/products/",
  validateProductIds,
  isAuthenticated,
  async (
    req: Request<{}, {}, ProductIdsBody>,
    res: Response<ProductResponse>,
  ) => {
    // Parameters
    const { product_ids: productIds } = req.body;
    // Validate Field
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    try {
      const product = await fetchProducts(productIds);

      if (product.length <= 0) {
        return res
          .status(404)
          .json({ error: "No se encontro ningun producto." });
      }

      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);

router.post(
  "/",
  isAuthenticated,
  async (req: Request<CreateProductBody>, res) => {
    const { name, price_cents, stock, category, url_image } = req.body;

    if (!name || !price_cents || !stock || !category || !url_image) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    try {
      const newProduct = await createProduct(req.body);
      res.status(201).json({
        message: "Se creo el producto exitosamente.",
        product: {
          product_id: newProduct?.product_id,
          name: newProduct?.product_id,
          stock: newProduct?.stock,
        },
      });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);

router.put(
  "/",
  isAuthenticated,
  async (req: Request<UpdateProductBody>, res) => {
    const productIdQuery = req.query.product_id as string;
    const productId = parseInt(productIdQuery, 10);

    try {
      await updateProduct(productId, req.body);
      res
        .status(200)
        .json({ message: "Los datos fueron actualizados exitosamente." });
    } catch (error) {
      res.status(500).json({ error: `Error en el servidor: ${error}` });
    }
  },
);

router.delete("/", isAuthenticated, async (req, res) => {
  const productIdQuery = req.query.product_id as string;
  const productId = parseInt(productIdQuery, 10);

  try {
    await isProductInactive(res);
    await softDeleteProduct(productId);

    res.status(200).json({ message: "Se elimino el producto exitosamente." });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});

export default router;
