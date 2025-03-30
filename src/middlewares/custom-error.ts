import { Request, Response, NextFunction } from "express";
import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

interface CustomError extends Error {
  httpCode?: number;
};

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: CustomError, req: Request, res: Response, next: NextFunction): void {
    const status = error.httpCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(status).json({ message });
  };
};