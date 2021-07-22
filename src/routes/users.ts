import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../entities';
import { UserController } from '../controllers';
import { checkJwt } from './middlewares';

const router = Router();

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } = StatusCodes;

// curl -H "Auth: ..." http://localhost:3000/users/all
router.get(
  '/all',
  [checkJwt],
  async (_: Request, res: Response): Promise<void> => {
    const users = await User.find();

    res.status(OK).json(users.map((user) => user.getTakeout()));
  },
);

// curl -H "Auth: ..." http://localhost:3000/users?id=1
router.get(
  '/',
  [checkJwt],
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const user = await User.findOne({ id });

    res.status(OK).json(user?.getTakeout());
  },
);

/*
curl -H "Auth: ..." -XPOST -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"email": "test@example.com", "name": "Newman", "password": "password"}'
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

    const user = await UserController.create(name, email, password);

    if (!user) {
      res.status(INTERNAL_SERVER_ERROR).send('Could not create user');
      return;
    }

    res.status(OK).json(user?.getTakeout());
  },
);

/*
curl -H "Auth: ..." -XPATCH -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"id": 1, "name": "new name"}'
*/
router.patch(
  '/',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, UserInput>,
    res: Response,
  ): Promise<void> => {
    const { id, email, name } = req.body;

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const user = await User.findOne({ id });

    if (!user) {
      res.status(NOT_FOUND).send('User not found');
      return;
    }

    await UserController.update(user, name, email);

    res.status(OK).json(user?.getTakeout());
  },
);

/*
curl -H "Auth: ..." -XDELETE -H "Content-Type: application/json" http://localhost:3000/users \
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

    if (typeof id !== 'string') {
      res.status(BAD_REQUEST).send('Missing id');
      return;
    }

    const user = await User.findOne({ id });

    if (!user) {
      res.status(NOT_FOUND).send('User not found');
      return;
    }

    await UserController.delete(user);

    res.status(OK).json({ id });
  },
);

export default router;
