import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { getAccessTokenExpiration, getJwtSecret } from '../../utils';

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

  // Return new token with every request
  const authToken = jwt.sign({ userId, username }, jwtSecret, {
    expiresIn: getAccessTokenExpiration(),
  });

  res.setHeader('authToken', authToken);

  next();
};
