import request from 'supertest';

import app from '../../server';
import { User } from '../../entities';
import intializeDB from '../../db';
import { clearDB, createJwt, createUser } from '../../testUtils';

beforeAll(async () => {
  await intializeDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('Users', () => {
  describe('get', () => {
    test('should not return user without auth', async () => {
      const user = await createUser({});

      const { body } = await request(app)
        .get('/users')
        .query({ id: user.id })
        .expect(401);

      expect(body).toMatchObject({});
    });
    test('should return user', async () => {
      const user = await createUser({});
      const token = createJwt({ email: user.email, userId: user.id });

      const { body } = await request(app)
        .get('/users')
        .set('auth', token)
        .query({ id: user.id })
        .expect(200);

      expect(body).toMatchObject(user);
    });
    test('/all should not return users without auth', async () => {
      await createUser({});
      const { body } = await request(app).get('/users/all').expect(401);
      expect(body).toMatchObject({});
    });
    test('/all should return users', async () => {
      const user1 = await createUser({});
      const user2 = await createUser({
        name: 'user 2',
        email: 'user2@example.com',
        password: 'password2',
      });
      const token = createJwt({ email: user1.email, userId: user1.id });
      const { body } = await request(app)
        .get('/users/all')
        .set('auth', token)
        .expect(200);
      expect(body).toMatchObject(expect.arrayContaining([user1, user2]));
    });
  });

  describe('post', () => {
    test('should not create user without auth', async () => {
      expect(await User.find({})).toHaveLength(0);

      const { body } = await request(app)
        .post('/users')
        .send({
          name: 'user 2',
          email: 'user2@example.com',
          password: 'password2',
        })
        .expect(401);

      expect(body).toMatchObject({});
      expect(await User.find({})).toHaveLength(0);
    });
    test('should create user with hashed password', async () => {
      const anotherUser = await createUser({});
      const token = createJwt({
        email: anotherUser.email,
        userId: anotherUser.id,
      });

      const { body } = await request(app)
        .post('/users')
        .set('auth', token)
        .send({
          name: 'user 2',
          email: 'user2@example.com',
          password: 'password2',
        })
        .expect(200);

      expect(body).toMatchObject(
        expect.objectContaining({ name: 'user 2', email: 'user2@example.com' }),
      );
      expect(body.id).toBeTruthy();
      expect(body.password).toBeTruthy();
      expect(body.password).not.toBe('password2');

      const user = await User.findOne({ id: body.id });
      expect(user).toMatchObject(body);
    });
  });

  describe('patch', () => {
    test('should not update user without auth', async () => {
      let user: User | undefined = await createUser({});
      const originalPassword = user.password;
      const originalName = user.name;
      const newName = 'new name';
      const newPassword = 'new password';

      const { body } = await request(app)
        .patch('/users')
        .send({
          id: user.id,
          name: newName,
          email: 'user1@example.com',
          password: newPassword,
        })
        .expect(401);

      expect(body).toMatchObject({});

      user = await User.findOne({ id: user.id });
      expect(user?.password).toBe(originalPassword);
      expect(user?.name).toBe(originalName);
    });
    test('should update user with hashed password', async () => {
      let user: User | undefined = await createUser({});
      const token = createJwt({ email: user.email, userId: user.id });
      const originalPassword = user.password;
      const originalEmail = user.email;
      const newName = 'new name';
      const newPassword = 'new password';

      const { body } = await request(app)
        .patch('/users')
        .set('auth', token)
        .send({
          id: user.id,
          name: newName,
          email: 'user1@example.com',
          password: newPassword,
        })
        .expect(200);

      expect(body).toMatchObject(
        expect.objectContaining({
          name: newName,
          email: originalEmail,
          id: user.id,
        }),
      );
      expect(body.password).toBeTruthy();
      expect(body.password).not.toBe(originalPassword);
      expect(body.password).not.toBe(newPassword);

      user = await User.findOne({ id: body.id });
      expect(user).toMatchObject(body);
    });
  });

  describe('delete', () => {
    test('should not delete user without auth', async () => {
      const user = await createUser({});
      expect(await User.find({})).toHaveLength(1);

      const { body } = await request(app)
        .delete('/users')
        .send({ id: user.id })
        .expect(401);

      expect(body).toMatchObject({});
      expect(await User.find({})).toHaveLength(1);
    });
    test('should delete user', async () => {
      const user = await createUser({});
      const token = createJwt({ email: user.email, userId: user.id });
      expect(await User.find({})).toHaveLength(1);

      const { body } = await request(app)
        .delete('/users')
        .set('auth', token)
        .send({ id: user.id })
        .expect(200);

      expect(body).toMatchObject({ id: user.id });
      expect(await User.find({})).toHaveLength(0);
    });
  });
});
