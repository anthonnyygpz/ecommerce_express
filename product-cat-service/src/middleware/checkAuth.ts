import { NextFunction, Request, Response } from "express"

export const isAuthenticated = (req: Request<any>, res: Response, next: NextFunction) => {
  if (req.session.userId && req.session.isAdmin) {
    next();
  } else {
    return res.status(401).send('Acceso denegado. Debes iniciar sesión como administrador')
  }

}
