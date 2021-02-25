import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { getJwtSecret } from '../../utils';

type JwtPayload = { userId: number; username: string };

export default (req: Request, res: Response, next: NextFunction): void => {
  const jwtSecret = getJwtSecret();
  const token = req.headers.auth as string;
  let jwtPayload;

  // Try to validate the token and get data
  try {
    jwtPayload = jwt.verify(token, jwtSecret) as JwtPayload;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send();
    return;
  }

  const { userId, username } = jwtPayload;

  // The token is valid for 1 hour. We want to send a new token on every request
  const newToken = jwt.sign({ userId, username }, jwtSecret, {
    expiresIn: '1h',
  });

  res.setHeader('token', newToken);

  next();
};
