import request from 'supertest';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import app from '../../server';
import intializeDB from '../../db';
import { User } from '../../entities';
import { hash } from '../../utils';
import { createJwt, createUser, runInTransaction } from '../../testUtils';

beforeAll(async () => {
  await intializeDB();
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();
});

describe('Auth', () => {
  describe('login should', () => {
    test(
      'fail without email',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        await createUser({ password: hashedPassword });

        const { headers } = await request(app)
          .post('/auth/login')
          .send({ password })
          .expect(400);

        expect(headers.authtoken).toBeFalsy();
        expect(headers['set-cookie']).toBeFalsy();
      }),
    );
    test(
      'fail without password',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        const user = await createUser({ password: hashedPassword });

        const { headers } = await request(app)
          .post('/auth/login')
          .send({ email: user?.email })
          .expect(400);

        expect(headers.authtoken).toBeFalsy();
        expect(headers['set-cookie']).toBeFalsy();
      }),
    );
    test(
      'fail with wrong email',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        await createUser({ password: hashedPassword });

        const { headers } = await request(app)
          .post('/auth/login')
          .send({ email: 'wrong.email@example.com', password })
          .expect(401);

        expect(headers.authtoken).toBeFalsy();
        expect(headers['set-cookie']).toBeFalsy();
      }),
    );
    test(
      'fail with wrong password',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        const user = await createUser({ password: hashedPassword });

        const { body } = await request(app)
          .post('/auth/login')
          .send({ email: user?.email, password: 'wrong password' })
          .expect(401);

        expect(Object.keys(body)).toHaveLength(0);
      }),
    );
    test(
      'return token',
      runInTransaction(async () => {
        const password = 'testPassword';
        const user = await createUser({ password });
        const { headers } = await request(app)
          .post('/auth/login')
          .send({ email: user?.email, password })
          .expect(200);

        expect(headers.authtoken).toEqual(expect.stringMatching(/^ey.+/i));
        expect(headers['set-cookie']).toHaveLength(1);
        expect(headers['set-cookie'][0]).toEqual(
          expect.stringMatching(/^refreshToken=ey.+HttpOnly$/i),
        );
      }),
    );
  });

  describe('reset password should', () => {
    test(
      'not reset password without auth',
      runInTransaction(async () => {
        let user = await createUser({});
        const originalPassword = user?.password;
        const newPassword = 'new password';

        await request(app)
          .patch('/auth/reset-password')
          .send({ password: newPassword })
          .expect(401);

        user = await User.findOne({ id: user?.id });

        expect(user?.password).toBeTruthy();
        expect(user?.password).toBe(originalPassword);
        expect(user?.password).not.toBe(newPassword);
      }),
    );
    test(
      "reset a user's password",
      runInTransaction(async () => {
        let user = await createUser({});
        const originalPassword = user?.password;
        const newPassword = 'new password';
        const token = createJwt({ email: user?.email, userId: user?.id });

        await request(app)
          .patch('/auth/reset-password')
          .set('auth', token)
          .send({ password: newPassword })
          .expect(200);

        user = await User.findOne({ id: user?.id });

        expect(user?.password).toBeTruthy();
        expect(user?.password).not.toBe(originalPassword);
        expect(user?.password).not.toBe(newPassword); // Should be hashed
      }),
    );
  });

  describe('refresh token should', () => {
    test(
      'not return new tokens without auth',
      runInTransaction(async () => {
        const { headers } = await request(app)
          .get('/auth/refresh-token')
          .expect(401);

        expect(headers.authtoken).toBeFalsy();
        expect(headers['set-cookie']).toBeFalsy();
      }),
    );
    test(
      'return a new auth and refresh token',
      runInTransaction(async () => {
        const user = await createUser({});
        const token = createJwt({ email: user?.email, userId: user?.id });

        const { headers } = await request(app)
          .get('/auth/refresh-token')
          .set('auth', token)
          .expect(200);

        expect(headers.authtoken).toEqual(expect.stringMatching(/^ey.+/i));
        expect(headers['set-cookie']).toHaveLength(1);
        expect(headers['set-cookie'][0]).toEqual(
          expect.stringMatching(/^refreshToken=ey.+HttpOnly$/i),
        );
      }),
    );
  });
});
