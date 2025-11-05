import { Router, Request, Response } from "express";
import { createProduct, fetchProducts, softDeleteProduct, updateProduct } from "../services/product.service";
import { CreateProductBody, ProductsResponse, UpdateProductBody } from "../models/product.model";
import { isProductExist, isProductInactive } from "../services/checkExists";
import { isAuthenticated } from "../middleware/checkAuth";

const router: Router = Router();

router.get('/', async (req: Request<{ page: number, limit: number }>, res: Response<ProductsResponse>) => {
  const { page, limit } = req.body;

  if (!page || !limit) {
    return res.status(400).json({ error: "Campos faltantes" })
  }

  try {
    const { products, pagination } = await fetchProducts(page, limit)

    res.status(200).json({ products: products, pagination: pagination });
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});

router.post('/', isAuthenticated, async (req: Request<CreateProductBody>, res) => {
  const { name, description, price_cents, stock } = req.body;

  if (!name || !description || !price_cents || !stock) {
    return res.status(400).json({ error: 'Faltan campos' })
  }

  try {
    await isProductExist(name, res)
    const newProduct = await createProduct(req.body)
    res.status(201).json({
      message: "Se creo el producto exitosamente.", product: {
        product_id: newProduct?.product_id,
        name: newProduct?.product_id,
        stock: newProduct?.stock
      }
    })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});

router.put('/', isAuthenticated, async (req: Request<UpdateProductBody>, res) => {
  const productIdQuery = req.query.product_id as string;
  const productId = parseInt(productIdQuery, 10);

  try {

    await updateProduct(productId, req.body)
    res.status(200).json({ message: "Los datos fueron actualizados exitosamente." })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

router.delete('/', isAuthenticated, async (req, res) => {
  const productIdQuery = req.query.product_id as string;
  const productId = parseInt(productIdQuery, 10);

  try {
    await isProductInactive(res)
    await softDeleteProduct(productId);

    res.status(200).json({ message: "Se elimino el producto exitosamente." })
  } catch (error) {
    res.status(500).json({ error: `Error en el servidor: ${error}` })
  }
})

export default router;
