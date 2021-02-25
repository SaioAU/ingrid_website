import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { User } from '../entities';
import { getJwtSecret } from '../utils';

// See https://js.plainenglish.io/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4
// for setting up user role checking

const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;

const router = Router();

// Check password and return new auth token
router.post(
  '/login',
  async (
    req: Request<GenericObject, GenericObject, UserInput>,
    res: Response,
  ): Promise<void> => {
    const jwtSecret = getJwtSecret();
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(BAD_REQUEST).send();
      return;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(UNAUTHORIZED).send();
      return;
    }

    if (!(await user.checkUnencryptedPassword(password))) {
      res.status(UNAUTHORIZED).send();
      return;
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, jwtSecret, {
      expiresIn: '1h',
    });

    // Send the jwt in the response
    res.status(OK).send(token);
  },
);

export default router;
