import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const serializeErrors = errors.array().map((err) => {
      if (err.type === 'field') {
        return {message: err.msg, field: err.path};
      }
      return {message: err.msg};
    });
    return res.status(400).json({ errors: serializeErrors });
  };

  next();
};