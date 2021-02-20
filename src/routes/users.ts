import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { User } from '../entities';

const router = Router();

type CreateUserBody = {email: string, name: string, password: string}

// curl http://localhost:3000/users/all
router.get('/all', async (_: Request, res: Response): Promise<void> => {
  const users = await User.find();

  res.status(StatusCodes.OK).json({ users });
});

/*
curl -XPOST -H "Content-Type: application/json" http://localhost:3000/users/create \
--data '{"email": "test@example.com", "name": "Newman", "password": "yolo1234"}'
*/
router.post('/create', async (req: Request<GenericObject, GenericObject, CreateUserBody>, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(StatusCodes.BAD_REQUEST).send('Missing email, name or password');
    return;
  }

  const newUser = new User();
  newUser.name = name;
  newUser.email = email;
  newUser.password = password; // TODO: Hash
  await newUser.save();

  res.status(StatusCodes.OK).json({});
});

/*
curl -XPOST -H "Content-Type: application/json" http://localhost:3000/users/create \
--data '{"userId": 1}'
*/
router.post('/delete', async (req: Request<GenericObject, GenericObject, { userId: number }>, res: Response): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    res.status(StatusCodes.BAD_REQUEST).send('Missing userId');
    return;
  }

  const userToRemove = await User.findOne({ id: userId });

  if (!userToRemove) {
    res.status(StatusCodes.NOT_FOUND).send('User not found');
    return;
  }

  await userToRemove.remove();

  res.status(StatusCodes.OK).json({});
});

export default router;
