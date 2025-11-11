import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
  req: Request<any>,
  res: Response<any>,
  next: NextFunction,
) => {
  if (
    req.session &&
    req.session.userId &&
    typeof req.session.isAdmin === "boolean"
  ) {
    next();
  } else {
    res.status(401).json({ message: "No autorizado" });
  }
};
