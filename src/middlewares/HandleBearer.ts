import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

interface CustomRequest extends Request {
  id?: string;
}

export function authenticateToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const token = tokenHeader.split(' ')[1]; // get token from header

  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET is not set' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET) as { _id: string };
    req.body.id = decodedToken._id; // Add id to request
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
