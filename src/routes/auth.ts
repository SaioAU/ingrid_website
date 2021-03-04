import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
// import { getConnection } from 'typeorm';

import { User } from '../entities';
import { checkJwt } from './middlewares';
import {
  getAccessTokenExpiration,
  getJwtSecret,
  getRefreshTokenExpiration,
  hash,
} from '../utils';

// Nice intro to JWT auth: https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/

// For setting up user role checking see
// https://js.plainenglish.io/creating-a-rest-api-with-jwt-authentication-and-role-based-authorization-using-typescript-fbfa3cab22a4

const {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} = StatusCodes;

const router = Router();

/*
Check password and return new auth token

curl -XPOST -H "Content-Type: application/json" http://localhost:3000/auth/login \
--data '{"email": "test@example.com", "password": "yolo1234"}'
*/
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

    // const users = await User.find({ email });
    // users.forEach((u) => User.delete(u));
    const user = await User.findOne({ email });

    if (!user) {
      res.status(UNAUTHORIZED).send();
      return;
    }

    if (!(await user.checkUnencryptedPassword(password))) {
      res.status(UNAUTHORIZED).send();
      return;
    }

    const authToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      {
        expiresIn: getAccessTokenExpiration(),
      },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      {
        expiresIn: getRefreshTokenExpiration(),
      },
    );

    // Send the jwts in the response
    res.setHeader('authToken', authToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(OK).send();
  },
);

router.patch(
  '/reset-password',
  [checkJwt],
  async (
    req: Request<GenericObject, GenericObject, UserInput>,
    res: Response,
  ): Promise<void> => {
    const { password } = req.body;
    const { userId } = res.locals.jwtPayload;

    if (!password) {
      res.status(BAD_REQUEST).send();
      return;
    }

    const user = await User.findOne({ id: userId });

    if (!user) {
      res.status(NOT_FOUND).send();
      return;
    }

    try {
      const hashedPassword = await hash(password);
      user.password = hashedPassword;
      await user.save();
      res.status(OK).send('Password updated');
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).send('Could not update user');
    }
  },
);

router.get(
  '/refresh-token',
  [checkJwt],
  async (_: Request, res: Response): Promise<void> => {
    const jwtSecret = getJwtSecret();
    const accessTokenExpiration = getAccessTokenExpiration();
    const refreshTokenExpiration = getRefreshTokenExpiration();

    const { userId } = res.locals.jwtPayload;
    const user = await User.findOne({ id: userId });

    if (!user) {
      res.status(NOT_FOUND).send();
      return;
    }

    const authToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      {
        expiresIn: accessTokenExpiration,
      },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      {
        expiresIn: refreshTokenExpiration,
      },
    );

    res.setHeader('authToken', authToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    res.status(OK).send();
  },
);

export default router;
