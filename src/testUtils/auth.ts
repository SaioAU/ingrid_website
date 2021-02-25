import request from 'supertest'; // eslint-disable-line import/no-extraneous-dependencies
import jwt from 'jsonwebtoken';

import app from '../server';
import { getJwtSecret } from '../utils';

export const getToken = async ({
  email,
  password,
}: {
  email?: string;
  password?: string;
}): Promise<string | undefined> => {
  const { text: token } = await request(app)
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return token;
};

export const createJwt = (payload: GenericObject): string => {
  const jwtSecret = getJwtSecret();
  return jwt.sign(payload, jwtSecret);
};
