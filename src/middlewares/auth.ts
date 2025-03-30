import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Service } from "typedi";

interface UserPayload {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
};

@Service()
@Middleware({ type: 'before' })
export default class AuthMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction) {

    if (req.method === 'GET') {
      if (!req.session?.jwt) {
        return res.status(401).json({ error: 'Not authorized' });
      };

      try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
        next();

      } catch (error) {
        return res.status(401).json({ error: 'Not authorized' });
      };

    } else {

      next();
    };

  };
};