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
  console.log('🚨', req.body);
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(StatusCodes.BAD_REQUEST).send('Missing email, name or password');
  }

  const newUser = new User();
  newUser.name = name;
  newUser.email = email;
  newUser.password = password; // TODO: Hash

  res.status(StatusCodes.OK).json({});
});

export default router;
