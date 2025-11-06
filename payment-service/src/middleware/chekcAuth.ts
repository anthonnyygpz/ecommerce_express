import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request<any>, res: Response, next: NextFunction) => {
  if (req.session.userId) {
    next()
  } else {
    res.status(401).send('Acceso denegado. Debes iniciar sesión.');
  }
}
