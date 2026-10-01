import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config.js';

export type AuthenticatedRequest = Request & {
  user?: { id: number; email: string; isAgeVerified: boolean };
};

export function signToken(payload: { sub: number; email: string; isAgeVerified: boolean }) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwtSecret) as {
      sub: number;
      email: string;
      isAgeVerified: boolean;
    };

    req.user = {
      id: decoded.sub,
      email: decoded.email,
      isAgeVerified: decoded.isAgeVerified,
    };
    return next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

export function requireAgeVerification(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user?.isAgeVerified) {
    return res.status(403).json({ error: 'Age verification is required.' });
  }
  return next();
}
