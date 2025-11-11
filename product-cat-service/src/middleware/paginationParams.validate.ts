import { query, ValidationChain } from "express-validator";

export const valitedatePaginationParams: ValidationChain[] = [
  query("page")
    .exists()
    .withMessage('El parámetro "page" es obligatorio.')
    .isInt({ min: 1 })
    .withMessage('El parámetro "page" debe ser un número entero positivo.'),
  query("limit")
    .exists()
    .withMessage('El parámetro "limit" es obligatorio.')
    .isInt({ min: 1 })
    .withMessage('El parámetro "limit" de ser un número entero positivo.'),
];
