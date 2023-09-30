import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

function validateResults(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    validationResult(req).throw();
    return next();
  } catch (error: any) {
    res.status(400);
    res.send({
      errors: error.array()
    });
  }
}

export default validateResults;
