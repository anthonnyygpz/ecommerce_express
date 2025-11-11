import { body, ValidationChain } from "express-validator";

export const validateProductIds: ValidationChain[] = [
  body("product_ids")
    .exists()
    .withMessage('El parámetro "product_ids" es obligatorio')
    .isArray({ min: 1 })
    .withMessage(
      'El parámetro "product_ids" debe ser una lista de enteros positivos',
    ),
];
