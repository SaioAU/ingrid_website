import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../entities';

const router = Router();

const { BAD_REQUEST, NOT_FOUND, OK } = StatusCodes;

type UserInput = {id?: number, email?: string, name?: string, password?: string}

// curl http://localhost:3000/users/all
router.get('/all', async (_: Request, res: Response): Promise<void> => {
  const users = await User.find();

  res.status(OK).json({ users });
});

/*
curl -XPOST -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"email": "test@example.com", "name": "Newman", "password": "yolo1234"}'
*/
router.post('/', async (req: Request<GenericObject, GenericObject, UserInput>, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(BAD_REQUEST).send('Missing email, name or password');
    return;
  }

  const user = new User();
  user.name = name;
  user.email = email;
  user.password = password; // TODO: Hash
  await user.save();

  res.status(OK).json(user);
});

/*
curl -XPATCH -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"id": 1, "name": "new name"}'
*/
router.patch('/', async (req: Request<GenericObject, GenericObject, UserInput>, res: Response): Promise<void> => {
  const {
    id, email, name, password,
  } = req.body;

  if (!id) {
    res.status(BAD_REQUEST).send('Missing id');
    return;
  }

  const user = await User.findOne({ id });

  if (!user) {
    res.status(NOT_FOUND).send('User not found');
    return;
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.password = password ?? user.password; // TODO: Hash
  await user.save();

  res.status(OK).json(user);
});

/*
curl -XDELETE -H "Content-Type: application/json" http://localhost:3000/users \
--data '{"id": 1}'
*/
router.delete('/', async (req: Request<GenericObject, GenericObject, UserInput>, res: Response): Promise<void> => {
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
});

export default router;
