import request from 'supertest'; // eslint-disable-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';

import app from '../server';
import { getJwtSecret } from '../utils';

export const getTokens = async ({
  email,
  password,
}: {
  email?: string;
  password?: string;
}): Promise<{ authToken?: string; refreshToken?: string }> => {
  const { body } = await request(app)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return { authToken: body?.authToken, refreshToken: body?.refreshToken };
};

export const createJwt = (payload: GenericObject): string => {
  const jwtSecret = getJwtSecret();
  return jwt.sign(payload, jwtSecret);
};
