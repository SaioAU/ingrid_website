import request from 'supertest';

import app from '../../server';
import { User } from '../../entities';
import intializeDB from '../../db';
import { clearDB } from '../../testUtils/db';

beforeAll(async () => {
  await intializeDB();
});

beforeEach(async () => {
  await clearDB();
});

const createUser = async ({ name, email, password }: { name: string, email: string, password: string }): Promise<User> => {
  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password;
  await user.save();
  return user;
};

describe('Users', () => {
  describe('get', () => {
    test.only('should return user', async () => {
      const user = await createUser({ name: 'user 1', email: 'user1@example.com', password: 'password1' });
      const { body } = await request(app).get('/users').query({ id: user.id }).expect(200);
      expect(body).toMatchObject(user);
    });
    test('/all should return empty', async () => {
      const { body } = await request(app).get('/users/all').expect(200);
      expect(body).toMatchObject([]);
    });
    test('/all should return users', async () => {
      const user1 = await createUser({ name: 'user 1', email: 'user1@example.com', password: 'password1' });
      const user2 = await createUser({ name: 'user 2', email: 'user2@example.com', password: 'password2' });
      const { body } = await request(app).get('/users/all').expect(200);
      expect(body).toMatchObject(expect.arrayContaining([user1, user2]));
    });
  });

  describe('post', () => {
    test('should create user with hashed password', async () => {
      const { body } = await request(app).post('/users').send({
        name: 'user 1',
        email: 'user1@example.com',
        password: 'password1',
      }).expect(200);

      expect(body).toMatchObject(expect.objectContaining({ name: 'user 1', email: 'user1@example.com' }));
      expect(body.id).toBeTruthy();
      expect(body.password).toBeTruthy();
      expect(body.password).not.toBe('password1');

      const user = await User.findOne({ id: body.id });
      expect(user).toMatchObject(body);
    });
  });
});
