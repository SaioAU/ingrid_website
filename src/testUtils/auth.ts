import jwt from 'jsonwebtoken';

import { getJwtSecret } from '../utils';

export const createJwt = (payload: GenericObject): string => {
  const jwtSecret = getJwtSecret();
  return jwt.sign(payload, jwtSecret);
};
