import request from 'supertest';

import app from '../../server';
import intializeDB from '../../db';
import { User } from '../../entities';
import { hash } from '../../utils';
import { clearDB, createJwt, createUser } from '../../testUtils';

beforeAll(async () => {
  await intializeDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Auth', () => {
  describe('login should', () => {
    test('fail without email', async () => {
      const password = 'testPassword';
      const hashedPassword = await hash(password);
      await createUser({ password: hashedPassword });

      const { headers } = await request(app)
        .post('/auth/login')
        .send({ password })
        .expect(400);

      expect(headers.authtoken).toBeFalsy();
      expect(headers['set-cookie']).toBeFalsy();
    });
    test('fail without password', async () => {
      const password = 'testPassword';
      const hashedPassword = await hash(password);
      const user = await createUser({ password: hashedPassword });

      const { headers } = await request(app)
        .post('/auth/login')
        .send({ email: user?.email })
        .expect(400);

      expect(headers.authtoken).toBeFalsy();
      expect(headers['set-cookie']).toBeFalsy();
    });
    test('fail with wrong email', async () => {
      const password = 'testPassword';
      const hashedPassword = await hash(password);
      await createUser({ password: hashedPassword });

      const { headers } = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong.email@example.com', password })
        .expect(401);

      expect(headers.authtoken).toBeFalsy();
      expect(headers['set-cookie']).toBeFalsy();
    });
    test('fail with wrong password', async () => {
      const password = 'testPassword';
      const hashedPassword = await hash(password);
      const user = await createUser({ password: hashedPassword });

      const { body } = await request(app)
        .post('/auth/login')
        .send({ email: user?.email, password: 'wrong password' })
        .expect(401);

      expect(Object.keys(body)).toHaveLength(0);
    });
    test('return token', async () => {
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
    });
  });

  describe('reset password should', () => {
    test('not reset password without auth', async () => {
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
    });
    test("reset a user's password", async () => {
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
    });
  });

  describe('refresh token should', () => {
    test('not return new tokens without auth cookie', async () => {
      const { headers } = await request(app)
        .get('/auth/refresh-token')
        .expect(401);

      expect(headers.authtoken).toBeFalsy();
      expect(headers['set-cookie']).toBeFalsy();
    });
    test('return a new auth and refresh token', async () => {
      const user = await createUser({});
      const token = createJwt({ email: user?.email, userId: user?.id });

      const { headers } = await request(app)
        .get('/auth/refresh-token')
        .set('Cookie', [`refreshToken=${token}`])
        .expect(200);

      expect(headers.authtoken).toEqual(expect.stringMatching(/^ey.+/i));
      expect(headers['set-cookie']).toHaveLength(1);
      expect(headers['set-cookie'][0]).toEqual(
        expect.stringMatching(/^refreshToken=ey.+HttpOnly$/i),
      );
    });
  });
});
