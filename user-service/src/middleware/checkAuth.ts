import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId && typeof req.session.isAdmin === 'boolean') {
    return next()
  } else {
    res.status(401).json({ message: 'No autorizado' });
  }
}
