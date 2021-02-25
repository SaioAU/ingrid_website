import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../entities';
import { hash } from '../utils';
import { checkJwt } from './middlewares';

const router = Router();

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = StatusCodes;

// TODO: create admin user

// curl http://localhost:3000/users/all
router.get(
  '/all',
  [checkJwt],
  async (_: Request, res: Response): Promise<void> => {
    const users = await User.find();

    res.status(OK).json(users);
  },
);

// curl http://localhost:3000/users?id=1
router.get(
  '/',
  [checkJwt],
  async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.query.id);

    if (!id) {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const user = await User.findOne({ id });

    res.status(OK).json(user);
  },
);

/*
curl -XPOST -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"email": "test@example.com", "name": "Newman", "password": "yolo1234"}'
*/
router.post(
  '/',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, UserInput>,
    res: Response,
  ): Promise<void> => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      res.status(BAD_REQUEST).send('Missing email, name or password');
      return;
    }

    const user = await User.createUser(name, email, password);

    if (!user) {
      res.status(INTERNAL_SERVER_ERROR).send('Could not create user');
      return;
    }

    res.status(OK).json(user);
  },
);

/*
curl -XPATCH -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"id": 1, "name": "new name"}'
*/
router.patch(
  '/',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, UserInput>,
    res: Response,
  ): Promise<void> => {
    const { id, email, name, password } = req.body;

    if (!id) {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const user = await User.findOne({ id });

    if (!user) {
      res.status(NOT_FOUND).send('User not found');
      return;
    }

    let updatedPassword = user.password;

    if (password) {
      try {
        updatedPassword = await hash(password);
      } catch (err) {
        res.status(INTERNAL_SERVER_ERROR).send('Could not update user');
      }
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.password = updatedPassword;

    await user.save();

    res.status(OK).json(user);
  },
);

/*
curl -XDELETE -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"id": 1}'
*/
router.delete(
  '/',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, UserInput>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.body;

    if (!id) {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const user = await User.findOne({ id });

    if (!user) {
      res.status(NOT_FOUND).send('User not found');
      return;
    }

    await user.remove();

    res.status(OK).json({ id });
  },
);

export default router;
