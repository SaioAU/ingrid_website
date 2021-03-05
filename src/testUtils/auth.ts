import jwt from 'jsonwebtoken';

import { getAccessTokenExpiration, getJwtSecret } from '../utils';

export const createJwt = (
  payload: GenericObject,
  expiration?: number,
): string => {
  const jwtSecret = getJwtSecret();
  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiration ?? getAccessTokenExpiration(),
  });
};
