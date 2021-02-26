import request from 'supertest';
import {
  initialiseTestTransactions,
  runInTransaction,
} from 'typeorm-test-transactions';

import app from '../../server';
import intializeDB from '../../db';
import { hash } from '../../utils';
import { createUser, getToken } from '../../testUtils';

beforeAll(async () => {
  await intializeDB();
  initialiseTestTransactions();
});

describe('Auth', () => {
  describe('login should', () => {
    test(
      'fail without email',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        await createUser({ password: hashedPassword });

        const { text: token } = await request(app)
          .post('/auth/login')
          .send({ password })
          .expect(400);

        expect(token).toBeFalsy();
      }),
    );
    test(
      'fail without password',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        const user = await createUser({ password: hashedPassword });

        const { text: token } = await request(app)
          .post('/auth/login')
          .send({ email: user?.email })
          .expect(400);

        expect(token).toBeFalsy();
      }),
    );
    test(
      'fail with wrong email',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        await createUser({ password: hashedPassword });

        const { text: token } = await request(app)
          .post('/auth/login')
          .send({ email: 'wrong.email@example.com', password })
          .expect(401);

        expect(token).toBeFalsy();
      }),
    );
    test(
      'fail with wrong password',
      runInTransaction(async () => {
        const password = 'testPassword';
        const hashedPassword = await hash(password);
        const user = await createUser({ password: hashedPassword });

        const { text: token } = await request(app)
          .post('/auth/login')
          .send({ email: user?.email, password: 'wrong password' })
          .expect(401);

        expect(token).toBeFalsy();
      }),
    );
    test(
      'return token',
      runInTransaction(async () => {
        const password = 'testPassword';
        const user = await createUser({ password });
        const token = await getToken({ email: user?.email, password });

        expect(token).toBeTruthy();
      }),
    );
  });
});
